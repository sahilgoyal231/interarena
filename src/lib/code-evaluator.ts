export function extractCppSignature(boilerPlateCode: string) {
    const match = boilerPlateCode.match(/class\s+\w+\s*\{[^]*?public:\s*([a-zA-Z0-9_<>:,\s\*&\[\]]+)\s+(\w+)\s*\(([^)]*)\)/);
    if (!match) return null;
    
    return {
        returnType: match[1].trim(),
        methodName: match[2].trim(),
        params: match[3].split(',').filter(p => p.trim() !== '').map(p => {
            const parts = p.trim().split(/\s+/);
            const name = parts.pop()?.replace(/&|\*/g, '') || '';
            const type = parts.join(' ').replace(/&/g, '').trim();
            return { name, type };
        })
    };
}

export function generateCppDriver(boilerPlateCode: string, testCaseInput: string): { driverCode: string, flattenedInput: string } | null {
    const sig = extractCppSignature(boilerPlateCode);
    if (!sig) return null;

    let flattenedInput = "";
    
    const paramValues: Record<string, string> = {};
    const regex = /(\w+)\s*=\s*(\[.*?\]|"[^"]*"|'[^']*'|[^,]+)/g;
    let m;
    while ((m = regex.exec(testCaseInput)) !== null) {
        paramValues[m[1]] = m[2].trim();
    }

    let cppMain = `\n\nint main() {\n`;
    cppMain += `    Solution sol;\n`;
    
    const callArgs: string[] = [];

    for (const p of sig.params) {
        const val = paramValues[p.name] || paramValues[p.name.replace(/_/g, '')]; 
        if (!val) continue;
        
        // Strip std:: prefix for simpler matching
        const cleanType = p.type.replace(/std::/g, '');

        if (cleanType.includes('vector<vector<int>>') || cleanType.includes('vector<vector<char>>')) {
             try {
                const matrix = JSON.parse(val.replace(/'/g, '"'));
                flattenedInput += `${matrix.length}\n`;
                const innerType = cleanType.includes('char') ? 'char' : 'int';
                cppMain += `    int _${p.name}_rows; std::cin >> _${p.name}_rows;\n`;
                cppMain += `    std::vector<std::vector<${innerType}>> ${p.name}(_${p.name}_rows);\n`;
                cppMain += `    for(int i=0; i<_${p.name}_rows; ++i) {\n`;
                cppMain += `        int cols; std::cin >> cols;\n`;
                cppMain += `        ${p.name}[i].resize(cols);\n`;
                cppMain += `        for(int j=0; j<cols; ++j) std::cin >> ${p.name}[i][j];\n`;
                cppMain += `    }\n`;
                
                for (const row of matrix) {
                    flattenedInput += `${row.length} ${row.join(' ')}\n`;
                }
             } catch (_e) {
                flattenedInput += `0\n`;
                cppMain += `    std::vector<std::vector<int>> ${p.name};\n`;
             }
        } else if (cleanType.includes('vector<int>') || cleanType.includes('vector<char>') || cleanType.includes('vector<string>')) {
            try {
                const arr = JSON.parse(val.replace(/'/g, '"'));
                flattenedInput += `${arr.length}\n${arr.join('\n')}\n`; // newlines for string safety
                const innerType = cleanType.includes('string') ? 'std::string' : (cleanType.includes('char') ? 'char' : 'int');
                cppMain += `    int _${p.name}_len; std::cin >> _${p.name}_len;\n`;
                cppMain += `    std::vector<${innerType}> ${p.name}(_${p.name}_len);\n`;
                cppMain += `    for(int i=0; i<_${p.name}_len; ++i) std::cin >> ${p.name}[i];\n`;
            } catch (_e) {
                flattenedInput += `0\n`;
                cppMain += `    std::vector<int> ${p.name};\n`;
            }
        } else if (cleanType.includes('int') || cleanType.includes('long') || cleanType.includes('double')) {
            flattenedInput += `${val}\n`;
            cppMain += `    ${p.type} ${p.name}; std::cin >> ${p.name};\n`;
        } else if (cleanType.includes('string')) {
            const strVal = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            flattenedInput += `${strVal}\n`;
            cppMain += `    std::string ${p.name}; std::cin >> std::ws; std::getline(std::cin, ${p.name});\n`;
        } else if (cleanType.includes('bool')) {
            flattenedInput += `${val.toLowerCase() === 'true' ? 1 : 0}\n`;
            cppMain += `    bool ${p.name}; std::cin >> ${p.name};\n`;
        } else if (cleanType.includes('char')) {
            const charVal = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            flattenedInput += `${charVal}\n`;
            cppMain += `    char ${p.name}; std::cin >> ${p.name};\n`;
        }
        
        callArgs.push(p.name);
    }

    if (sig.returnType !== 'void') {
        cppMain += `    auto res = sol.${sig.methodName}(${callArgs.join(', ')});\n`;
        if (sig.returnType.includes('vector')) {
            cppMain += `    for(int i=0; i<res.size(); ++i) std::cout << res[i] << (i == res.size()-1 ? "" : " ");\n`;
        } else if (sig.returnType.includes('bool')) {
            cppMain += `    std::cout << (res ? "true" : "false");\n`;
        } else {
            cppMain += `    std::cout << res;\n`;
        }
    } else {
        cppMain += `    sol.${sig.methodName}(${callArgs.join(', ')});\n`;
        // For void, print the first reference parameter
        const refParam = sig.params.find(p => p.type.includes('&') && p.type.includes('vector'));
        if (refParam) {
            cppMain += `    for(int i=0; i<${refParam.name}.size(); ++i) std::cout << ${refParam.name}[i] << (i == ${refParam.name}.size()-1 ? "" : " ");\n`;
        }
    }
    
    cppMain += `    return 0;\n}`;
    
    return { driverCode: cppMain, flattenedInput: flattenedInput.trim() };
}

export function generatePythonDriver(boilerPlateCode: string, testCaseInput: string): string {
    return `\n
import sys
import ast
import re

if __name__ == '__main__':
    input_str = """${testCaseInput.replace(/"/g, '\\"')}"""
    
    # Try to extract the class name
    class_match = re.search(r'class\\s+(\\w+)', '''${boilerPlateCode}''')
    
    try:
        if class_match:
            class_name = class_match.group(1)
            target = locals()[class_name]()
        else:
            target = None
            
        # Naive param extraction
        params = []
        for match in re.finditer(r'\\w+\\s*=\\s*(\\[.*?\\]|"[^"]*"|\\'[^\\']*\\'|[^,]+)', input_str):
            val = match.group(1).strip()
            try:
                # ast.literal_eval handles single quotes, True/False naturally
                params.append(ast.literal_eval(val))
            except:
                params.append(val)
                
        # Find method
        def run_target(t):
            for attr in dir(t):
                if not attr.startswith('__') and callable(getattr(t, attr)):
                    method = getattr(t, attr)
                    res = method(*params)
                    if res is not None:
                        if isinstance(res, bool):
                            print("true" if res else "false")
                        elif isinstance(res, list):
                            print(" ".join(map(str, res)) if res else "[]")
                        else:
                            print(res)
                    else:
                        # if void, maybe modify in place, print first param
                        if len(params) > 0 and isinstance(params[0], list):
                            print(" ".join(map(str, params[0])))
                    return True
            return False

        if target is not None:
            run_target(target)
        else:
            # Standalone function
            found = False
            for k, v in locals().items():
                if callable(v) and not k.startswith('__') and k not in ['sys', 'ast', 're']:
                    res = v(*params)
                    if res is not None:
                        if isinstance(res, bool):
                            print("true" if res else "false")
                        elif isinstance(res, list):
                            print(" ".join(map(str, res)) if res else "[]")
                        else:
                            print(res)
                    else:
                        if len(params) > 0 and isinstance(params[0], list):
                            print(" ".join(map(str, params[0])))
                    found = True
                    break
            
    except Exception as e:
        print("Driver Error:", str(e))
`;
}

export function extractJavaSignature(boilerPlateCode: string) {
    const match = boilerPlateCode.match(/class\s+\w+\s*\{[^]*?public\s+(static\s+)?([a-zA-Z0-9_<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)/);
    if (!match) return null;
    
    return {
        returnType: match[2].trim(),
        methodName: match[3].trim(),
        params: match[4].split(',').filter(p => p.trim() !== '').map(p => {
            const parts = p.trim().split(/\s+/);
            const name = parts.pop() || '';
            const type = parts.join(' ').trim();
            return { name, type };
        })
    };
}

export function generateJavaDriver(boilerPlateCode: string, testCaseInput: string): { driverCode: string, flattenedInput: string } | null {
    const sig = extractJavaSignature(boilerPlateCode);
    if (!sig) return null;

    let flattenedInput = "";
    
    const paramValues: Record<string, string> = {};
    const regex = /(\w+)\s*=\s*(\[.*?\]|"[^"]*"|'[^']*'|[^,]+)/g;
    let m;
    while ((m = regex.exec(testCaseInput)) !== null) {
        paramValues[m[1]] = m[2].trim();
    }

    let javaMain = `\n\n    public static void main(String[] args) {\n`;
    javaMain += `        java.util.Scanner scanner = new java.util.Scanner(System.in);\n`;
    javaMain += `        Solution sol = new Solution();\n`;
    
    const callArgs: string[] = [];

    for (const p of sig.params) {
        const val = paramValues[p.name];
        if (!val) continue;

        if (p.type.includes('[]') && !p.type.includes('[][]')) {
            try {
                const arr = JSON.parse(val.replace(/'/g, '"'));
                flattenedInput += `${arr.length}\n${arr.join('\n')}\n`;
                const innerType = p.type.replace('[]', '');
                javaMain += `        int _${p.name}_len = scanner.nextInt();\n`;
                javaMain += `        ${innerType}[] ${p.name} = new ${innerType}[_${p.name}_len];\n`;
                javaMain += `        for(int i=0; i<_${p.name}_len; ++i) ${p.name}[i] = scanner.nextInt();\n`;
            } catch(_e) {
                javaMain += `        ${p.type} ${p.name} = null;\n`;
            }
        } else if (p.type === 'int' || p.type === 'long') {
            flattenedInput += `${val}\n`;
            javaMain += `        ${p.type} ${p.name} = scanner.next${p.type === 'int' ? 'Int' : 'Long'}();\n`;
        } else if (p.type === 'String') {
            const strVal = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            flattenedInput += `${strVal}\n`;
            javaMain += `        String ${p.name} = scanner.next();\n`;
        } else if (p.type === 'boolean') {
            flattenedInput += `${val.toLowerCase() === 'true' ? 'true' : 'false'}\n`;
            javaMain += `        boolean ${p.name} = scanner.nextBoolean();\n`;
        }
        
        callArgs.push(p.name);
    }

    if (sig.returnType !== 'void') {
        javaMain += `        ${sig.returnType} res = sol.${sig.methodName}(${callArgs.join(', ')});\n`;
        if (sig.returnType.includes('[]')) {
            javaMain += `        for(int i=0; i<res.length; ++i) System.out.print(res[i] + (i == res.length-1 ? "" : " "));\n`;
        } else {
            javaMain += `        System.out.print(res);\n`;
        }
    } else {
        javaMain += `        sol.${sig.methodName}(${callArgs.join(', ')});\n`;
        const refParam = sig.params.find(p => p.type.includes('[]'));
        if (refParam) {
            javaMain += `        for(int i=0; i<${refParam.name}.length; ++i) System.out.print(${refParam.name}[i] + (i == ${refParam.name}.length-1 ? "" : " "));\n`;
        }
    }
    
    javaMain += `    }\n`;
    
    return { driverCode: javaMain, flattenedInput: flattenedInput.trim() };
}

export function generateJsDriver(boilerPlateCode: string, testCaseInput: string): string {
    return `\n
const inputStr = \`${testCaseInput.replace(/`/g, '\\`')}\`;
const paramValues = {};
const regex = /(\\w+)\\s*=\\s*(\\[.*?\\]|"[^"]*"|'[^']*'|[^,]+)/g;
let m;
while ((m = regex.exec(inputStr)) !== null) {
    let val = m[2].trim();
    try { val = JSON.parse(val.replace(/'/g, '"')); } catch(e) {}
    paramValues[m[1]] = val;
}

// Find the function to call
let targetFunc = null;
if (typeof Solution !== 'undefined') {
    const sol = new Solution();
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(sol))) {
        if (key !== 'constructor' && typeof sol[key] === 'function') {
            targetFunc = sol[key].bind(sol);
            break;
        }
    }
} else {
    // Look for raw function
    const localKeys = Object.keys(this).concat(Object.keys(globalThis));
    for (const key of localKeys) {
        if (typeof globalThis[key] === 'function' && key !== 'generateJsDriver') {
            targetFunc = globalThis[key];
            break;
        }
    }
}

if (targetFunc) {
    const args = Object.values(paramValues);
    const res = targetFunc(...args);
    if (res !== undefined && res !== null) {
        if (Array.isArray(res)) {
            console.log(res.join(" "));
        } else {
            console.log(res);
        }
    } else if (Array.isArray(args[0])) {
        console.log(args[0].join(" "));
    }
}
`;
}
