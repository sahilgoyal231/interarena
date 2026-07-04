import "dotenv/config";
import { QuestionType } from "@prisma/client";
import prisma from "../src/lib/prisma";

const guessQuestions = [
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction sayHi() {\n  console.log(name);\n  console.log(age);\n  var name = 'Lydia';\n  let age = 21;\n}\n\nsayHi();\n```",
    options: JSON.stringify(["Lydia and 21", "Lydia and ReferenceError", "ReferenceError and 21", "undefined and ReferenceError"]),
    correctAnswer: "undefined and ReferenceError",
    explanation: "Variables declared with `var` are hoisted with a default value of `undefined`. Variables with `let` are also hoisted but remain uninitialized in the Temporal Dead Zone (TDZ). Thus, `name` logs undefined, and `age` throws a ReferenceError."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst shape = {\n  radius: 10,\n  diameter() {\n    return this.radius * 2;\n  },\n  perimeter: () => 2 * Math.PI * this.radius\n};\n\nconsole.log(shape.diameter());\nconsole.log(shape.perimeter());\n```",
    options: JSON.stringify(["20 and 62.83", "20 and NaN", "20 and 63", "NaN and 63"]),
    correctAnswer: "20 and NaN",
    explanation: "Arrow functions do not bind their own `this`. The `this` in `perimeter` refers to the surrounding scope (window/global), which doesn't have a `radius` property. Thus `this.radius` is undefined, and multiplying by it results in `NaN`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst bird = {\n  size: 'small'\n};\n\nconst mouse = {\n  name: 'Mickey',\n  small: true\n};\n\nconsole.log(mouse[bird.size]);\nconsole.log(mouse[bird[\"size\"]]);\n```",
    options: JSON.stringify(["true and true", "true and undefined", "undefined and true", "Error"]),
    correctAnswer: "true and true",
    explanation: "In JavaScript, all object keys are strings. `bird.size` resolves to the string `'small'`. `mouse['small']` then evaluates to `true`. `bird[\"size\"]` is identical to `bird.size`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1);\n}\n```",
    options: JSON.stringify(["0 1 2", "3 3 3", "Undefined", "Error"]),
    correctAnswer: "3 3 3",
    explanation: "Because `var` is function-scoped (not block-scoped), the `setTimeout` closures all capture the same `i` variable from the same memory location, which equals 3 after the loop finishes executing."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nlet number = 0;\nconsole.log(number++);\nconsole.log(++number);\nconsole.log(number);\n```",
    options: JSON.stringify(["1 1 2", "1 2 2", "0 2 2", "0 1 2"]),
    correctAnswer: "0 2 2",
    explanation: "The postfix unary operator `number++` returns the value before incrementing, logging 0. The prefix unary operator `++number` increments first and then returns the value, logging 2. The final log is simply 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef extendList(val, list=[]):\n    list.append(val)\n    return list\n\nlist1 = extendList(10)\nlist2 = extendList(123,[])\nlist3 = extendList('a')\n\nprint(list1)\nprint(list2)\nprint(list3)\n```",
    options: JSON.stringify(["[10, 'a']\\n[123]\\n[10, 'a']", "[10]\\n[123]\\n['a']", "[10, 123, 'a']\\n[123]\\n[10, 123, 'a']", "Error"]),
    correctAnswer: "[10, 'a']\\n[123]\\n[10, 'a']",
    explanation: "Default arguments in Python are evaluated only once at function definition time. `list1` and `list3` share the exact same default list object in memory, while `list2` is passed its own new list."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    def __init__(self):\n        self.calcI(30)\n        print(\"i from A is\", self.i)\n\n    def calcI(self, i):\n        self.i = 2 * i\n\nclass B(A):\n    def __init__(self):\n        super().__init__()\n        \n    def calcI(self, i):\n        self.i = 3 * i\n\nb = B()\n```",
    options: JSON.stringify(["i from A is 60", "i from A is 90", "Error: B has no i attribute", "i from B is 90"]),
    correctAnswer: "i from A is 90",
    explanation: "When `super().__init__()` is called in `B`, it calls `A`'s init. However, `self` is an instance of `B`. Due to polymorphism, `self.calcI(30)` inside `A` calls the overridden `calcI` in `B`, multiplying 30 by 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nmultipliers = [lambda x: i * x for i in range(4)]\nprint([m(2) for m in multipliers])\n```",
    options: JSON.stringify(["[0, 2, 4, 6]", "[0, 0, 0, 0]", "[6, 6, 6, 6]", "[8, 8, 8, 8]"]),
    correctAnswer: "[6, 6, 6, 6]",
    explanation: "This demonstrates Python's late-binding behavior. The lambdas do not capture the value of `i` during creation; they look up `i` in the surrounding scope at execution time, which will be 3 (the final value of the loop)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\n\nprint(x)\n```",
    options: JSON.stringify(["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "Undefined"]),
    correctAnswer: "[1, 2, 3, 4]",
    explanation: "Python lists are mutable objects. Assigning `y = x` does not create a copy of the list; it simply creates a new reference `y` pointing to the exact same list in memory. Changing `y` changes `x`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef f(x, l=[]):\n    for i in range(x):\n        l.append(i*i)\n    print(l)\n\nf(2)\nf(3, [3, 2, 1])\nf(3)\n```",
    options: JSON.stringify(["[0, 1]\\n[3, 2, 1, 0, 1, 4]\\n[0, 1, 0, 1, 4]", "[0, 1]\\n[3, 2, 1, 0, 1, 4]\\n[0, 1, 4]", "[0, 1]\\n[3, 2, 1, 0, 1, 2]\\n[0, 1, 0, 1, 2]", "Error"]),
    correctAnswer: "[0, 1]\\n[3, 2, 1, 0, 1, 4]\\n[0, 1, 0, 1, 4]",
    explanation: "The default argument `l=[]` is initialized once. `f(2)` modifies it to `[0, 1]`. `f(3, [...])` uses a new list and does not modify the default. `f(3)` modifies the original default list again, appending 0, 1, and 4."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nusing namespace std;\n\nclass Base {\npublic:\n    virtual void show() {\n        cout << \"Base\";\n    }\n};\n\nclass Derived : public Base {\npublic:\n    void show() {\n        cout << \"Derived\";\n    }\n};\n\nint main() {\n    Base *b;\n    Derived d;\n    b = &d;\n    b->show();\n    return 0;\n}\n```",
    options: JSON.stringify(["Base", "Derived", "Compiler Error", "Runtime Error"]),
    correctAnswer: "Derived",
    explanation: "Because `show()` is declared as a `virtual` function in the Base class, C++ uses dynamic dispatch (late binding). Even though the pointer is of type Base*, it points to a Derived object, so `Derived::show()` is called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[] = {10, 20, 30};\n    int *ptr = arr;\n    ++*ptr;\n    printf(\"%d %d\", *ptr, arr[0]);\n    return 0;\n}\n```",
    options: JSON.stringify(["11 10", "10 11", "11 11", "20 20"]),
    correctAnswer: "11 11",
    explanation: "`*ptr` accesses the value at index 0 (which is 10). The prefix increment `++` operates on the value itself. Thus, the value at `arr[0]` is incremented to 11. Printing `*ptr` and `arr[0]` both yield 11."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <cstring>\nusing namespace std;\n\nint main() {\n    char str[] = \"GeeksforGeeks\";\n    cout << sizeof(str) << \" \" << strlen(str);\n    return 0;\n}\n```",
    options: JSON.stringify(["13 13", "14 13", "13 14", "14 14"]),
    correctAnswer: "14 13",
    explanation: "`sizeof()` calculates the total allocated memory in bytes, which includes the null terminator `\\0` at the end of the string (13 characters + 1 = 14). `strlen()` calculates the length of the string ignoring the null terminator (13)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nusing namespace std;\n\nvoid swap(int *x, int *y) {\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}\n\nint main() {\n    int a = 10, b = 20;\n    swap(&a, &b);\n    cout << a << \" \" << b;\n    return 0;\n}\n```",
    options: JSON.stringify(["10 20", "20 10", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "20 10",
    explanation: "The variables `a` and `b` are passed by pointer (address). The `swap` function dereferences these pointers and swaps the actual values in memory, so the original variables are successfully modified."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5;\n    int y = x++ + ++x;\n    cout << y;\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "11", "12", "Undefined Behavior"]),
    correctAnswer: "Undefined Behavior",
    explanation: "Modifying a variable multiple times within the same sequence point (like `x++ + ++x`) violates C++ standards, leading to Undefined Behavior. Different compilers may output 10, 11, 12, or crash entirely."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s1 = \"hello\";\n        String s2 = new String(\"hello\");\n        System.out.println(s1 == s2);\n        System.out.println(s1.equals(s2));\n    }\n}\n```",
    options: JSON.stringify(["true\\ntrue", "false\\ntrue", "true\\nfalse", "false\\nfalse"]),
    correctAnswer: "false\\ntrue",
    explanation: "The `==` operator compares object references (memory addresses). `s1` is in the string pool, while `s2` is created dynamically using `new`, resulting in different references. `.equals()` compares the actual string values."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Test {\n    public static void main(String[] args) {\n        try {\n            int x = 0;\n            int y = 5 / x;\n        } catch (Exception e) {\n            System.out.print(\"Exception \");\n        } catch (ArithmeticException ae) {\n            System.out.print(\"ArithmeticException \");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Exception", "ArithmeticException", "Compile Time Error", "Exception ArithmeticException"]),
    correctAnswer: "Compile Time Error",
    explanation: "In Java, catch blocks must be ordered from most specific to most general. Because `ArithmeticException` inherits from `Exception`, the first catch block covers everything, making the second block unreachable (compile-time error)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass A {\n    static { System.out.print(\"1 \"); }\n    public A() { System.out.print(\"2 \"); }\n}\nclass B extends A {\n    static { System.out.print(\"3 \"); }\n    public B() { System.out.print(\"4 \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        B b = new B();\n    }\n}\n```",
    options: JSON.stringify(["1 2 3 4", "3 4 1 2", "1 3 2 4", "2 4 1 3"]),
    correctAnswer: "1 3 2 4",
    explanation: "Static blocks are executed first, in order from Parent to Child (`1 3`). Then, the constructors are executed, again from Parent to Child (`2 4`). Thus the output is `1 3 2 4`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Integer a = 127, b = 127;\n        Integer c = 128, d = 128;\n        System.out.println(a == b);\n        System.out.println(c == d);\n    }\n}\n```",
    options: JSON.stringify(["true\\ntrue", "false\\nfalse", "true\\nfalse", "false\\ntrue"]),
    correctAnswer: "true\\nfalse",
    explanation: "Java maintains an Integer Cache for values between -128 and 127. Values within this range share the same object reference, so `a == b` is true. Values outside this range create new objects, making `c == d` false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    static void foo(Object o) {\n        System.out.println(\"Object\");\n    }\n    static void foo(String s) {\n        System.out.println(\"String\");\n    }\n    public static void main(String[] args) {\n        foo(null);\n    }\n}\n```",
    options: JSON.stringify(["Object", "String", "Compile Time Error", "NullPointerException"]),
    correctAnswer: "String",
    explanation: "When resolving method overloading with a `null` argument, Java chooses the most specific matching type. Since `String` is a subclass of `Object`, `String` is the more specific type, so `foo(String)` is invoked."
  },
  // Advanced JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log('start');\nsetTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promise1')).then(() => console.log('promise2'));\nconsole.log('end');\n```",
    options: JSON.stringify(["start\\nend\\ntimeout\\npromise1\\npromise2", "start\\ntimeout\\npromise1\\npromise2\\nend", "start\\nend\\npromise1\\npromise2\\ntimeout", "start\\npromise1\\npromise2\\nend\\ntimeout"]),
    correctAnswer: "start\\nend\\npromise1\\npromise2\\ntimeout",
    explanation: "Synchronous code logs 'start' and 'end' first. The `setTimeout` callback goes to the Macrotask queue, while `Promise` callbacks go to the Microtask queue. The Event Loop prioritizes emptying the Microtask queue ('promise1', 'promise2') before picking up the next Macrotask ('timeout')."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction Person(firstName, lastName) {\n  this.firstName = firstName;\n  this.lastName = lastName;\n}\n\nconst member = new Person('John', 'Doe');\nPerson.getFullName = function() {\n  return `${this.firstName} ${this.lastName}`;\n};\n\nconsole.log(member.getFullName());\n```",
    options: JSON.stringify(["John Doe", "undefined undefined", "TypeError", "ReferenceError"]),
    correctAnswer: "TypeError",
    explanation: "You can't add properties or methods to a constructor function like a regular object and expect instances to inherit them. To make it available to instances, you must add it to the prototype: `Person.prototype.getFullName = ...`. Calling `member.getFullName()` throws a TypeError."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nlet config = {\n  alert: setInterval(() => {\n    console.log('Alert!');\n  }, 1000)\n};\n\nconfig = null;\n```",
    options: JSON.stringify(["Memory leak, 'Alert!' continues logging", "Interval is cleared, nothing logs", "Throws an Error", "Logs 'Alert!' exactly once"]),
    correctAnswer: "Memory leak, 'Alert!' continues logging",
    explanation: "Setting `config` to `null` only removes the reference to the object. The `setInterval` function continues running in the background because its callback is held by the environment's timer mechanism, causing a memory leak unless `clearInterval` is explicitly called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst proxy = new Proxy({}, {\n  get: (target, prop) => prop in target ? target[prop] : 42\n});\n\nconsole.log(proxy.answer);\nconsole.log('answer' in proxy);\n```",
    options: JSON.stringify(["42 and true", "42 and false", "undefined and true", "undefined and false"]),
    correctAnswer: "42 and false",
    explanation: "The `get` trap intercepts the property access and returns `42` since 'answer' is not in the target. However, the `in` operator uses the `has` trap (which defaults to checking the target directly). Since 'answer' is not in the target object, it evaluates to `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([] + []);\nconsole.log({} + []);\nconsole.log([] + {});\n```",
    options: JSON.stringify(["\"\"\\n0\\n\"[object Object]\"", "\"\"\\nNaN\\n\"[object Object]\"", "\"\"\\n\"[object Object]\"\\n\"[object Object]\"", "0\\nNaN\\nNaN"]),
    correctAnswer: "\"\"\\n0\\n\"[object Object]\" (or \"[object Object]\" for {} + [] in some envs)",
    explanation: "Type coercion! `[] + []` converts both to empty strings: `\"\"`. `{} + []` can be interpreted as an empty block `{}` followed by unary `+[]` (which is `0`). `[] + {}` converts both to strings: `\"\" + \"[object Object]\"` resulting in `\"[object Object]\"`. (Note: in some console environments like Chrome, `{} + []` evaluates to `\"[object Object]\"`)."
  },
  // Advanced Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef make_multiplier(x):\n    def multiplier(y):\n        return x * y\n    return multiplier\n\nfuncs = [make_multiplier(i) for i in range(3)]\nprint([f(3) for f in funcs])\n```",
    options: JSON.stringify(["[0, 3, 6]", "[6, 6, 6]", "[0, 0, 0]", "Error"]),
    correctAnswer: "[0, 3, 6]",
    explanation: "Unlike lambda functions created in a loop, here `make_multiplier` creates a new closure scope every time it is called. The value of `x` is properly bound and captured for each function, so they multiply by 0, 1, and 2 respectively."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Base:\n    def __init__(self):\n        print('Base')\n\nclass A(Base):\n    def __init__(self):\n        print('A')\n        super().__init__()\n\nclass B(Base):\n    def __init__(self):\n        print('B')\n        super().__init__()\n\nclass C(A, B):\n    def __init__(self):\n        print('C')\n        super().__init__()\n\nc = C()\n```",
    options: JSON.stringify(["C\\nA\\nBase", "C\\nA\\nB\\nBase", "C\\nA\\nBase\\nB\\nBase", "Error: Method Resolution Order"]),
    correctAnswer: "C\\nA\\nB\\nBase",
    explanation: "Python uses C3 Linearization for Method Resolution Order (MRO). The MRO for `C` is `[C, A, B, Base, object]`. When `super()` is called in `A`, it delegates to the next class in `C`'s MRO, which is `B`, not `Base`. Finally, `B`'s `super()` calls `Base`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef generator():\n    yield 1\n    return 2\n    yield 3\n\ng = generator()\nprint(next(g))\ntry:\n    print(next(g))\nexcept StopIteration as e:\n    print(e.value)\n```",
    options: JSON.stringify(["1\\n2", "1\\n3", "1\\nStopIteration", "1\\nNone"]),
    correctAnswer: "1\\n2",
    explanation: "The first `next(g)` yields `1`. When `next(g)` is called again, the generator hits the `return 2` statement. In Python, returning from a generator raises a `StopIteration` exception, and the return value is attached to the exception's `value` attribute."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 10\ndef foo():\n    print(x)\n    x += 1\n\nfoo()\n```",
    options: JSON.stringify(["10", "11", "UnboundLocalError", "NameError"]),
    correctAnswer: "UnboundLocalError",
    explanation: "In Python, if a variable is assigned a value anywhere within a function's body (`x += 1`), it is considered a local variable for the entire function. Since `print(x)` executes before the local `x` is assigned, it throws an `UnboundLocalError`. You would need `global x` to modify the global variable."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(True == False == False)\nprint((True == False) == False)\n```",
    options: JSON.stringify(["False\\nTrue", "False\\nFalse", "True\\nFalse", "True\\nTrue"]),
    correctAnswer: "False\\nTrue",
    explanation: "Python supports chained comparisons. `True == False == False` is evaluated as `(True == False) and (False == False)`, which is `False and True`, evaluating to `False`. However, with parentheses `(True == False) == False` evaluates to `False == False`, which is `True`."
  },
  // Advanced C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <memory>\n\nclass Node {\npublic:\n    std::shared_ptr<Node> next;\n    ~Node() { std::cout << \"Deleted \"; }\n};\n\nint main() {\n    auto node1 = std::make_shared<Node>();\n    auto node2 = std::make_shared<Node>();\n    node1->next = node2;\n    node2->next = node1;\n    return 0;\n}\n```",
    options: JSON.stringify(["Deleted Deleted", "No output", "Segmentation Fault", "Compiler Error"]),
    correctAnswer: "No output",
    explanation: "This creates a circular dependency using `std::shared_ptr`. `node1` points to `node2`, and `node2` points to `node1`. When `main` finishes, their reference counts drop to 1, not 0, so the memory is leaked and destructors are never called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nint main() {\n    int a = 10;\n    auto lambda = [a]() mutable {\n        a++;\n        std::cout << a << \" \";\n    };\n    lambda();\n    std::cout << a;\n    return 0;\n}\n```",
    options: JSON.stringify(["11 11", "10 10", "11 10", "Compiler Error"]),
    correctAnswer: "11 10",
    explanation: "The variable `a` is captured by value. The `mutable` keyword allows the lambda to modify its own internal copy of `a`, printing 11. However, this does not affect the original `a` in the outer scope, which remains 10."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <utility>\n\nvoid print(int& x) { std::cout << \"LValue \"; }\nvoid print(int&& x) { std::cout << \"RValue \"; }\n\ntemplate <typename T>\nvoid forwarder(T&& arg) {\n    print(arg);\n    print(std::forward<T>(arg));\n}\n\nint main() {\n    forwarder(5);\n    return 0;\n}\n```",
    options: JSON.stringify(["LValue RValue", "RValue RValue", "LValue LValue", "RValue LValue"]),
    correctAnswer: "LValue RValue",
    explanation: "In `forwarder(5)`, `T` is inferred as `int`. `arg` has a name and is an lvalue within the function body, so `print(arg)` calls the LValue overload. `std::forward<T>(arg)` perfectly forwards `arg` as an RValue, calling the RValue overload."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nclass Base {\npublic:\n    virtual void print(int x = 10) {\n        std::cout << \"Base: \" << x;\n    }\n};\n\nclass Derived : public Base {\npublic:\n    void print(int x = 20) override {\n        std::cout << \"Derived: \" << x;\n    }\n};\n\nint main() {\n    Base* obj = new Derived();\n    obj->print();\n    delete obj;\n    return 0;\n}\n```",
    options: JSON.stringify(["Base: 10", "Derived: 20", "Derived: 10", "Base: 20"]),
    correctAnswer: "Derived: 10",
    explanation: "Default arguments are resolved statically at compile-time based on the pointer type (`Base*`), so `10` is passed. However, the function call is resolved dynamically at run-time (virtual dispatch), calling `Derived::print`. So it prints 'Derived: 10'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nint main() {\n    int arr[5] = {1, 2, 3, 4, 5};\n    std::cout << 2[arr];\n    return 0;\n}\n```",
    options: JSON.stringify(["2", "3", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "3",
    explanation: "In C and C++, array subscripting `a[b]` is exactly equivalent to `*(a + b)`. Thus `2[arr]` evaluates to `*(2 + arr)`, which is identical to `*(arr + 2)` or `arr[2]`, which is the 3rd element of the array: 3."
  },
  // Advanced Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(test());\n    }\n    \n    public static int test() {\n        try {\n            return 1;\n        } finally {\n            return 2;\n        }\n    }\n}\n```",
    options: JSON.stringify(["1", "2", "Compile Time Error", "1 followed by 2"]),
    correctAnswer: "2",
    explanation: "The `finally` block always executes after `try`, even if there is a `return` statement in `try`. A `return` statement in the `finally` block overrides any previous return values, so the method returns 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.Arrays;\nimport java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = Arrays.asList(1, 2, 3);\n        list.stream()\n            .peek(System.out::print)\n            .filter(n -> n % 2 == 0);\n    }\n}\n```",
    options: JSON.stringify(["123", "2", "No output", "Compile Time Error"]),
    correctAnswer: "No output",
    explanation: "Java Streams are lazily evaluated. This means intermediate operations (like `peek` and `filter`) do not execute until a terminal operation (like `collect`, `forEach`, `count`) is invoked. Since there is no terminal operation, the stream is never processed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s = \"Java\";\n        s.concat(\" SE\");\n        s.replace('a', 'e');\n        System.out.println(s);\n    }\n}\n```",
    options: JSON.stringify(["Java SE", "Jeve", "Jeve SE", "Java"]),
    correctAnswer: "Java",
    explanation: "Strings in Java are immutable. Methods like `concat()` and `replace()` create and return new String objects. Because the code does not assign the result back to `s` (e.g., `s = s.concat(\" SE\")`), the original string \"Java\" remains completely unchanged."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    public void display(String s) {\n        System.out.println(\"Base String\");\n    }\n}\nclass Derived extends Base {\n    public void display(Object o) {\n        System.out.println(\"Derived Object\");\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Derived obj = new Derived();\n        obj.display(\"Hello\");\n    }\n}\n```",
    options: JSON.stringify(["Base String", "Derived Object", "Compile Time Error", "Runtime Error"]),
    correctAnswer: "Base String",
    explanation: "This is an example of method overloading, not overriding, because the parameter types (`String` vs `Object`) differ. The `Derived` class inherits `display(String)` from `Base`. When `obj.display(\"Hello\")` is called, Java finds the exact match `display(String)` and executes it."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Double a = 0.0 / 0.0;\n        System.out.println(a == a);\n        System.out.println(a.equals(a));\n    }\n}\n```",
    options: JSON.stringify(["true\\ntrue", "false\\nfalse", "false\\ntrue", "true\\nfalse"]),
    correctAnswer: "false\\ntrue",
    explanation: "`0.0 / 0.0` results in `Double.NaN` (Not a Number). In Java, `NaN == NaN` always evaluates to `false` according to IEEE 754 specifications. However, the `Double.equals()` method explicitly checks if both objects are `NaN` and returns `true` if they are."
  },
  // --- BATCH 1: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = {\n  name: 'Alice',\n  sayName: function() {\n    setTimeout(() => {\n      console.log(this.name);\n    }, 10);\n  }\n};\nconst fn = obj.sayName;\nfn();\n```",
    options: JSON.stringify(["Alice", "undefined", "TypeError", "ReferenceError"]),
    correctAnswer: "undefined",
    explanation: "Because `fn` is extracted and invoked as a standalone function (`fn()`), the `this` context inside `sayName` is bound to the global object (or `undefined` in strict mode), not `obj`. The arrow function in `setTimeout` inherits this global `this`, where `name` is undefined."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst numbers = [1, 2, 3];\nnumbers[10] = 11;\nconsole.log(numbers.length);\n```",
    options: JSON.stringify(["3", "4", "11", "Error"]),
    correctAnswer: "11",
    explanation: "JavaScript arrays are sparse. Assigning a value to an index beyond the current bounds automatically resizes the array length to `index + 1`. The missing elements (indices 3 through 9) are empty slots."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(['1', '7', '11'].map(parseInt));\n```",
    options: JSON.stringify(["[1, 7, 11]", "[1, NaN, 3]", "[1, NaN, 11]", "Error"]),
    correctAnswer: "[1, NaN, 3]",
    explanation: "`Array.prototype.map` passes 3 arguments to the callback: value, index, and array. `parseInt` takes two: string and radix. Thus, it runs: `parseInt('1', 0)` -> 1, `parseInt('7', 1)` -> NaN (radix 1 is invalid), `parseInt('11', 2)` -> 3 (binary 11 is 3)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nlet x = 10;\n(function() {\n  console.log(x);\n  let x = 20;\n})();\n```",
    options: JSON.stringify(["10", "20", "undefined", "ReferenceError"]),
    correctAnswer: "ReferenceError",
    explanation: "Variables declared with `let` are hoisted to the top of their block scope but remain uninitialized in the 'Temporal Dead Zone'. Since `let x = 20` shadows the outer `x`, trying to access it before initialization throws a ReferenceError."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = { a: 1 };\nObject.freeze(obj);\nobj.a = 2;\nobj.b = 3;\nconsole.log(obj.a, obj.b);\n```",
    options: JSON.stringify(["2 3", "1 undefined", "TypeError", "1 3"]),
    correctAnswer: "1 undefined",
    explanation: "`Object.freeze()` makes an object immutable. In non-strict mode, reassigning properties or adding new ones fails silently (in strict mode, it throws a TypeError). Thus `a` remains 1 and `b` is undefined."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(typeof typeof 1);\n```",
    options: JSON.stringify(["number", "string", "object", "undefined"]),
    correctAnswer: "string",
    explanation: "`typeof 1` evaluates to the string `\"number\"`. Then `typeof \"number\"` evaluates to the string `\"string\"`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen1() {\n  yield 2;\n  yield 3;\n}\nfunction* gen2() {\n  yield 1;\n  yield* gen1();\n  yield 4;\n}\nconsole.log([...gen2()]);\n```",
    options: JSON.stringify(["[1, [2, 3], 4]", "[1, 2, 3, 4]", "[1, Object, 4]", "Error"]),
    correctAnswer: "[1, 2, 3, 4]",
    explanation: "The `yield*` expression delegates to another iterable object (like a generator). It yields all values from `gen1()` sequentially before resuming `gen2()`, resulting in a flattened array."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = {};\nconst b = { key: 'b' };\nconst c = { key: 'c' };\na[b] = 123;\na[c] = 456;\nconsole.log(a[b]);\n```",
    options: JSON.stringify(["123", "456", "undefined", "Error"]),
    correctAnswer: "456",
    explanation: "Object keys are automatically coerced to strings. Both `b` and `c` are coerced to the string `\"[object Object]\"`. Therefore, `a[c]` overwrites the same key set by `a[b]`, resulting in 456."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\na = [1, 2, 3]\nb = a\na = a + [4]\nprint(b)\n```",
    options: JSON.stringify(["[1, 2, 3, 4]", "[1, 2, 3]", "Error", "Undefined"]),
    correctAnswer: "[1, 2, 3]",
    explanation: "Unlike `a += [4]` which modifies the list in place, `a = a + [4]` creates a brand new list and assigns it to `a`. The variable `b` still references the original unmutated list `[1, 2, 3]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef append_to(num, target=[]):\n    target.append(num)\n    return target\n\nprint(append_to(1))\nprint(append_to(2))\n```",
    options: JSON.stringify(["[1]\\n[2]", "[1]\\n[1, 2]", "Error", "[1, 2]\\n[1, 2]"]),
    correctAnswer: "[1]\\n[1, 2]",
    explanation: "Default arguments are evaluated only once at definition time. The `target` list is created once and shared across all function calls that omit the argument. The second call appends to the same list."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Singleton(object):\n    _instance = None\n    def __new__(cls, *args, **kwargs):\n        if not cls._instance:\n            cls._instance = super(Singleton, cls).__new__(cls, *args, **kwargs)\n        return cls._instance\n\ns1 = Singleton()\ns2 = Singleton()\nprint(s1 is s2)\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "This is a classic Singleton pattern using `__new__`. Since `s1` and `s2` are returned as the exact same instantiated object from `_instance`, the `is` operator evaluates to `True`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntpl = (1, 2, [3, 4])\ntpl[2].append(5)\nprint(tpl)\n```",
    options: JSON.stringify(["(1, 2, [3, 4])", "(1, 2, [3, 4, 5])", "TypeError", "AttributeError"]),
    correctAnswer: "(1, 2, [3, 4, 5])",
    explanation: "While tuples are immutable (you cannot reassign `tpl[2] = something else`), the objects inside them can be mutable. You are modifying the internal state of the list, which is completely valid."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nnames = ['Alice', 'Bob', 'Charlie']\nfor name in names:\n    if name == 'David':\n        break\nelse:\n    print('Not found')\n```",
    options: JSON.stringify(["Alice Bob Charlie", "Not found", "Error", "No output"]),
    correctAnswer: "Not found",
    explanation: "In Python, a `for...else` loop executes the `else` block if the loop completes normally without encountering a `break` statement. Since 'David' is never found, it doesn't break, and 'Not found' is printed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(bool('False'))\nprint(bool(''))\n```",
    options: JSON.stringify(["False\\nFalse", "True\\nTrue", "True\\nFalse", "False\\nTrue"]),
    correctAnswer: "True\\nFalse",
    explanation: "In Python, any non-empty string evaluates to `True`, regardless of its content (even the string `'False'`). Only empty strings `''` evaluate to `False`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef outer():\n    x = 1\n    def inner():\n        x += 1\n        print(x)\n    inner()\nouter()\n```",
    options: JSON.stringify(["1", "2", "UnboundLocalError", "NameError"]),
    correctAnswer: "UnboundLocalError",
    explanation: "Because `x += 1` involves assignment, Python treats `x` as a local variable inside `inner`. It tries to read `x` before assignment, throwing an `UnboundLocalError`. To fix this, you must declare `nonlocal x` inside `inner`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 256\ny = 256\na = 257\nb = 257\nprint(x is y, a is b)\n```",
    options: JSON.stringify(["True True", "False False", "True False", "False True"]),
    correctAnswer: "True False (in standard CPython REPL)",
    explanation: "CPython caches small integers from -5 to 256. Variables assigned to these values point to the same memory address, so `x is y` is True. Integers larger than 256 are created as new objects, so `a is b` evaluates to False (Note: compilation in scripts may optimize this to True True, but REPL strictly shows True False)."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nclass Animal {\npublic:\n    virtual void speak() { std::cout << \"Animal \"; }\n};\nclass Dog : public Animal {\npublic:\n    void speak() override { std::cout << \"Dog \"; }\n};\n\nvoid makeSpeak(Animal a) {\n    a.speak();\n}\n\nint main() {\n    Dog d;\n    makeSpeak(d);\n    return 0;\n}\n```",
    options: JSON.stringify(["Dog", "Animal", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "Animal",
    explanation: "This is known as Object Slicing. Because `makeSpeak` takes an `Animal` by value (not by pointer or reference), the `Dog` object is sliced into a pure `Animal` object upon copying. Thus, `Animal::speak()` is called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nclass Base {\npublic:\n    ~Base() { std::cout << \"~Base \"; }\n};\nclass Derived : public Base {\npublic:\n    ~Derived() { std::cout << \"~Derived \"; }\n};\n\nint main() {\n    Base* obj = new Derived();\n    delete obj;\n    return 0;\n}\n```",
    options: JSON.stringify(["~Derived ~Base", "~Base", "~Derived", "Undefined Behavior"]),
    correctAnswer: "~Base (leads to Undefined Behavior)",
    explanation: "Because the destructor in `Base` is not marked `virtual`, deleting a `Derived` object through a `Base` pointer only calls the `Base` destructor, leaking the `Derived` part and causing Undefined Behavior."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nint main() {\n    int a = 5;\n    int& ref = a;\n    int a2 = 10;\n    ref = a2;\n    std::cout << a << \" \" << ref;\n    return 0;\n}\n```",
    options: JSON.stringify(["5 10", "10 10", "5 5", "Compiler Error"]),
    correctAnswer: "10 10",
    explanation: "References in C++ cannot be reseated once bound. `ref = a2;` does not bind `ref` to `a2`; it assigns the *value* of `a2` to the variable `ref` is already referencing (`a`). Thus, `a` becomes 10."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v;\n    v.push_back(1);\n    v.push_back(2);\n    \n    int* ptr = &v[0];\n    v.push_back(3);\n    v.push_back(4);\n    v.push_back(5);\n    \n    std::cout << *ptr;\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "Garbage/Crash", "3", "Compiler Error"]),
    correctAnswer: "Garbage/Crash",
    explanation: "Adding elements to a `std::vector` may exceed its capacity, causing it to reallocate a new block of memory and move the elements there. This invalidates all previous pointers, iterators, and references, making `ptr` a dangling pointer."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nint main() {\n    const int x = 10;\n    int* p = (int*)&x;\n    *p = 20;\n    std::cout << x << \" \" << *p;\n    return 0;\n}\n```",
    options: JSON.stringify(["10 20", "20 20", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Undefined Behavior (Often prints 10 20)",
    explanation: "Casting away `const` and modifying a genuinely `const` variable results in Undefined Behavior. Compilers often inline the constant `x`, so `cout << x` prints 10, while `*p` prints the modified memory 20."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\ntemplate <typename T>\nvoid func(T x) { std::cout << \"Template \"; }\n\nvoid func(int x) { std::cout << \"Non-Template \"; }\n\nint main() {\n    func(5);\n    func<>(5);\n    return 0;\n}\n```",
    options: JSON.stringify(["Non-Template Template", "Template Template", "Non-Template Non-Template", "Compiler Error"]),
    correctAnswer: "Non-Template Template",
    explanation: "When resolving function overloads, C++ prefers a non-template exact match over a template function, so `func(5)` prints 'Non-Template'. Using explicit template syntax `func<>(5)` forces the compiler to instantiate and call the template version."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n\nint main() {\n    char str1[] = \"Hello\";\n    char str2[] = \"Hello\";\n    const char* str3 = \"Hello\";\n    const char* str4 = \"Hello\";\n    std::cout << (str1 == str2) << (str3 == str4);\n    return 0;\n}\n```",
    options: JSON.stringify(["00", "11", "01", "10"]),
    correctAnswer: "01",
    explanation: "`str1` and `str2` are separate character arrays initialized with copies of the string, so their memory addresses differ (`0`). `str3` and `str4` are pointers to string literals. Compilers optimize identical string literals to point to the same read-only memory, so their addresses match (`1`)."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String a = \"InterArena\";\n        String b = \"Inter\" + \"Arena\";\n        String c = \"Inter\";\n        String d = c + \"Arena\";\n        System.out.println((a == b) + \" \" + (a == d));\n    }\n}\n```",
    options: JSON.stringify(["true true", "false false", "true false", "false true"]),
    correctAnswer: "true false",
    explanation: "String literals combined with `+` are resolved at compile-time and placed in the String pool (`a == b` is true). Variables concatenated at run-time (`c + \"Arena\"`) create a new String object on the heap, so their references differ (`a == d` is false)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Thread t = new Thread(() -> {\n            System.out.print(\"Thread \");\n        });\n        t.run();\n        System.out.print(\"Main\");\n    }\n}\n```",
    options: JSON.stringify(["Thread Main", "Main Thread", "Error", "Non-deterministic"]),
    correctAnswer: "Thread Main",
    explanation: "Calling `t.run()` instead of `t.start()` does not spawn a new thread. It executes the `run()` method synchronously on the main thread. Therefore, it will always predictably print 'Thread ' followed by 'Main'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>();\n        list.add(\"A\");\n        list.add(\"B\");\n        list.add(\"C\");\n        for (String s : list) {\n            if (s.equals(\"B\")) {\n                list.remove(s);\n            }\n        }\n        System.out.println(list);\n    }\n}\n```",
    options: JSON.stringify(["[A, C]", "[A, B, C]", "ConcurrentModificationException", "IndexOutOfBoundsException"]),
    correctAnswer: "ConcurrentModificationException",
    explanation: "Modifying a collection (`list.remove`) while iterating over it using a for-each loop (which uses an Iterator internally) invalidates the Iterator, immediately throwing a `ConcurrentModificationException`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    static void method(Integer i) { System.out.print(\"Integer \"); }\n    static void method(long l) { System.out.print(\"long \"); }\n    \n    public static void main(String[] args) {\n        int i = 5;\n        method(i);\n    }\n}\n```",
    options: JSON.stringify(["Integer", "long", "Compile Error", "Runtime Error"]),
    correctAnswer: "long",
    explanation: "In Java method overloading, widening primitive conversion (`int` to `long`) takes priority over boxing (`int` to `Integer`). Therefore, the method taking `long` is executed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    static void display() { System.out.print(\"Base \"); }\n}\nclass Derived extends Base {\n    static void display() { System.out.print(\"Derived \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Base b = new Derived();\n        b.display();\n    }\n}\n```",
    options: JSON.stringify(["Base", "Derived", "Compile Error", "Runtime Error"]),
    correctAnswer: "Base",
    explanation: "Static methods cannot be overridden; they are hidden. Because static methods are resolved at compile-time based on the reference type (which is `Base`), `Base.display()` is called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.print(\"A \");\n            throw new RuntimeException();\n        } catch (Exception e) {\n            System.out.print(\"B \");\n            System.exit(0);\n        } finally {\n            System.out.print(\"C \");\n        }\n    }\n}\n```",
    options: JSON.stringify(["A B C", "A C B", "A B", "A C"]),
    correctAnswer: "A B",
    explanation: "Usually, `finally` always executes. However, `System.exit(0)` immediately terminates the JVM. When the JVM shuts down in the `catch` block, the `finally` block does not execute."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s1 = new String(\"Hello\");\n        String s2 = s1.intern();\n        String s3 = \"Hello\";\n        System.out.println((s1 == s2) + \" \" + (s2 == s3));\n    }\n}\n```",
    options: JSON.stringify(["true true", "false true", "false false", "true false"]),
    correctAnswer: "false true",
    explanation: "`s1` is created on the heap via `new`. `s1.intern()` returns the canonical representation from the String pool (which it creates). `s3` is a literal, so it points to the pool. Thus `s2 == s3` is true, but `s1` is still on the heap, so `s1 == s2` is false."
  },
  // --- BATCH 2: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n  printName() {\n    console.log(this.name);\n  }\n}\nconst u = new User('Bob');\nconst print = u.printName;\nprint();\n```",
    options: JSON.stringify(["Bob", "undefined", "TypeError", "ReferenceError"]),
    correctAnswer: "TypeError",
    explanation: "This is known as 'method tearing'. When `print` is extracted from the instance, it loses its `this` context. Furthermore, class bodies implicitly execute in `strict mode`, meaning `this` becomes `undefined` (instead of the global object). Calling `this.name` on `undefined` throws a TypeError."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([1] == 1);\nconsole.log([1] === 1);\n```",
    options: JSON.stringify(["true\\nfalse", "false\\nfalse", "true\\ntrue", "false\\ntrue"]),
    correctAnswer: "true\\nfalse",
    explanation: "The loose equality `==` operator performs type coercion. An array with a single element `[1]` is coerced to its primitive string representation `\"1\"`, which is then coerced to the number `1`. The strict equality `===` operator checks both value and type without coercion, so it returns false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [1, 2, 3];\ndelete arr[1];\nconsole.log(arr.length);\nconsole.log(arr);\n```",
    options: JSON.stringify(["2\\n[1, 3]", "3\\n[1, empty, 3]", "2\\n[1, undefined, 3]", "Error"]),
    correctAnswer: "3\\n[1, empty, 3]",
    explanation: "The `delete` operator removes the property (value) from the array but does NOT reindex the array or update its `length`. It simply leaves an `empty` slot (or `undefined` when accessed) at index 1. To actually remove an element and shrink the array, you must use `splice()`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\ntry {\n  [].reduce((a, b) => a + b);\n} catch (e) {\n  console.log('Error');\n}\n```",
    options: JSON.stringify(["undefined", "null", "Error", "NaN"]),
    correctAnswer: "Error",
    explanation: "Calling `Array.prototype.reduce()` on an empty array without providing an initial value throws a `TypeError: Reduce of empty array with no initial value`. Thus, the catch block is executed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nPromise.resolve(1)\n  .then((x) => {\n    throw x;\n  })\n  .then((x) => console.log('success', x))\n  .catch((err) => {\n    console.log('error', err);\n    return 2;\n  })\n  .then((x) => console.log('success', x));\n```",
    options: JSON.stringify(["error 1", "error 1\\nsuccess 2", "error 1\\nsuccess undefined", "success 1\\nerror 1"]),
    correctAnswer: "error 1\\nsuccess 2",
    explanation: "The first `then` throws `1`, which skips the second `then` and is caught by the `catch` block (logging 'error 1'). The `catch` block returns `2`. Returning a value from a `catch` block resolves the Promise chain successfully, so the final `then` receives `2` and logs 'success 2'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfor (var i = 0; i < 3; i++) {\n  setTimeout((function(i_local) {\n    return function() { console.log(i_local); }\n  })(i), 100);\n}\n```",
    options: JSON.stringify(["3 3 3", "0 1 2", "undefined", "Error"]),
    correctAnswer: "0 1 2",
    explanation: "This is a classic closure fix using an Immediately Invoked Function Expression (IIFE). By passing `i` into the IIFE as `i_local`, we create a new scope for each iteration that freezes the current value of `i`. The returned function closes over `i_local` instead of the mutable `var i`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst p = Promise.race([\n  new Promise(r => setTimeout(r, 10, 'A')),\n  new Promise((_, r) => setTimeout(r, 5, 'B'))\n]);\np.then(console.log).catch(console.error);\n```",
    options: JSON.stringify(["A", "B", "TypeError", "A B"]),
    correctAnswer: "B",
    explanation: "`Promise.race` settles as soon as the *first* promise in the iterable settles (either resolves or rejects). Since the second promise rejects after 5ms (faster than the first promise resolves after 10ms), the race rejects with 'B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(1 < 2 < 3);\nconsole.log(3 > 2 > 1);\n```",
    options: JSON.stringify(["true\\ntrue", "false\\nfalse", "true\\nfalse", "false\\ntrue"]),
    correctAnswer: "true\\nfalse",
    explanation: "Relational operators evaluate left-to-right. `1 < 2 < 3` evaluates as `(1 < 2) < 3` -> `true < 3`. Coercing `true` to a number gives `1 < 3`, which is `true`. However, `3 > 2 > 1` evaluates as `(3 > 2) > 1` -> `true > 1`. Coercing `true` gives `1 > 1`, which is `false`."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Test:\n    x = 1\n\nt1 = Test()\nt2 = Test()\nt1.x = 2\nTest.x = 3\nprint(t1.x, t2.x, Test.x)\n```",
    options: JSON.stringify(["2 3 3", "3 3 3", "2 2 3", "1 3 3"]),
    correctAnswer: "2 3 3",
    explanation: "When you do `t1.x = 2`, it creates an *instance* variable `x` on `t1` that shadows the class variable. However, `t2` has no instance variable `x`, so `t2.x` looks up the class variable. Changing `Test.x = 3` updates the class variable, affecting `t2.x` and `Test.x`, but not the shadowed `t1.x`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {1: 'A', True: 'B', 1.0: 'C'}\nprint(len(d), d[1])\n```",
    options: JSON.stringify(["3 C", "1 C", "1 A", "3 A"]),
    correctAnswer: "1 C",
    explanation: "In Python dictionaries, keys are hashed. Since `1`, `True`, and `1.0` all evaluate to the exact same hash value and are considered equal (`1 == True == 1.0`), they are treated as the exact same key. Each subsequent assignment overwrites the value. Thus, there is only 1 key, and its value is 'C'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef test():\n    try:\n        return 1\n    except Exception:\n        return 2\n    finally:\n        return 3\n\nprint(test())\n```",
    options: JSON.stringify(["1", "2", "3", "Error"]),
    correctAnswer: "3",
    explanation: "The `finally` block in Python is always executed before leaving the `try` statement, even if a `return` was triggered inside `try` or `except`. A `return` inside `finally` overrides any previously executed `return` statements."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef gen():\n    val = yield 1\n    yield val\n\ng = gen()\nprint(next(g))\nprint(g.send(10))\n```",
    options: JSON.stringify(["1\\nNone", "1\\n10", "1\\nError", "None\\n10"]),
    correctAnswer: "1\\n10",
    explanation: "The first `next(g)` runs to the first `yield` and returns `1`. The execution pauses there. When `g.send(10)` is called, the value `10` is substituted in place of the paused `yield` expression, so `val` becomes `10`. The generator resumes, hitting `yield val` and returning `10`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 5\nfuncs = [lambda: x for x in range(3)]\nprint(funcs[0]())\n```",
    options: JSON.stringify(["0", "2", "5", "Error"]),
    correctAnswer: "2",
    explanation: "This is late binding. The lambdas do not capture the value of `x` at definition; they look up `x` in the surrounding scope when called. By the time `funcs[0]()` is called, the list comprehension has finished and the loop variable `x` equals 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntup1 = (1, 2, 4)\ntup2 = (1, 2, 3, 5)\nprint(tup1 > tup2)\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "Tuples (and lists) in Python are compared lexicographically element by element. It compares `1 == 1`, then `2 == 2`, and then `4 > 3`, which is True. It stops evaluating as soon as it finds a difference, regardless of the tuples' lengths."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef decorator(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs)\n    return wrapper\n\n@decorator\ndef my_func():\n    \"\"\"This is my function.\"\"\"\n    pass\n\nprint(my_func.__name__)\n```",
    options: JSON.stringify(["my_func", "wrapper", "decorator", "None"]),
    correctAnswer: "wrapper",
    explanation: "When you use a decorator without `functools.wraps`, the original function's metadata (like `__name__` and `__doc__`) is lost because it is replaced by the `wrapper` function. Thus, its name becomes 'wrapper'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef func(a, b, *args, **kwargs):\n    print(len(args), len(kwargs))\n\ndct = {'c': 3, 'd': 4}\nfunc(1, 2, 3, 4, **dct)\n```",
    options: JSON.stringify(["2 2", "0 2", "4 2", "Error"]),
    correctAnswer: "2 2",
    explanation: "`1` binds to `a`, `2` binds to `b`. The positional arguments `3` and `4` are packed into the `args` tuple (length 2). The unpacked dictionary `**dct` provides keyword arguments `c=3, d=4`, which are packed into the `kwargs` dictionary (length 2)."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Empty {};\nclass VirtualEmpty {\n    virtual void foo() {}\n};\nint main() {\n    std::cout << sizeof(Empty) << \" \" << sizeof(VirtualEmpty);\n    return 0;\n}\n```",
    options: JSON.stringify(["0 0", "1 8", "1 4", "0 8"]),
    correctAnswer: "1 8 (or 1 4 on 32-bit systems)",
    explanation: "An empty class in C++ requires a minimum size of 1 byte to guarantee unique addresses for distinct objects. Adding a `virtual` function introduces a virtual table pointer (vptr), increasing the size to the size of a pointer (8 bytes on 64-bit systems, 4 on 32-bit)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v;\n    v.reserve(10);\n    std::cout << v.size();\n    return 0;\n}\n```",
    options: JSON.stringify(["0", "10", "Garbage", "Compiler Error"]),
    correctAnswer: "0",
    explanation: "`reserve(10)` allocates memory for at least 10 elements (increasing `capacity`), but it does NOT actually construct the elements or change the logical `size` of the vector. To change `size`, you must use `resize(10)` or push elements."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Test {\npublic:\n    mutable int x;\n    Test() : x(0) {}\n    void change() const { x = 10; }\n};\nint main() {\n    const Test t;\n    t.change();\n    std::cout << t.x;\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "10",
    explanation: "The `mutable` keyword allows a class member variable to be modified even if the containing object is `const`, or if the method modifying it is marked as `const`. The compilation succeeds and the variable is safely modified."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A {\npublic:\n    A() { std::cout << \"A \"; }\n};\nclass B : public A {\npublic:\n    B() : A() { std::cout << \"B \"; }\n};\nint main() {\n    B b[2];\n    return 0;\n}\n```",
    options: JSON.stringify(["A B", "B A", "A B A B", "A A B B"]),
    correctAnswer: "A B A B",
    explanation: "When instantiating an array of objects `B b[2]`, the constructor is called for each element sequentially. For the first element, it constructs `Base` then `Derived` (A B). It repeats this completely for the second element (A B)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <type_traits>\nint main() {\n    int a = 5;\n    int& b = a;\n    auto c = b;\n    decltype(auto) d = b;\n    c = 10;\n    d = 20;\n    std::cout << a;\n    return 0;\n}\n```",
    options: JSON.stringify(["5", "10", "20", "Compiler Error"]),
    correctAnswer: "20",
    explanation: "The `auto` keyword drops references, so `c` is deduced as just `int` (a copy). However, `decltype(auto)` perfectly preserves exact types, so `d` is deduced as `int&` (a reference to `a`). Modifying `d` modifies `a` to 20."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nusing namespace std;\nvoid func(int *ptr) { cout << \"Ptr \"; }\nvoid func(int val) { cout << \"Val \"; }\nint main() {\n    func(NULL);\n    func(nullptr);\n    return 0;\n}\n```",
    options: JSON.stringify(["Val Ptr", "Ptr Ptr", "Compiler Error", "Val Val"]),
    correctAnswer: "Val Ptr (or Compiler Error for NULL due to ambiguity in older standards)",
    explanation: "In C++, `NULL` is typically defined as the integer literal `0`, so `func(NULL)` matches `func(int)`. However, `nullptr` is of type `nullptr_t`, which implicitly converts to any pointer type, so `func(nullptr)` matches `func(int *ptr)`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    Base() { std::cout << \"B \"; }\n    ~Base() { std::cout << \"~B \"; }\n};\nint main() {\n    try {\n        Base b;\n        throw 1;\n    } catch (int e) {\n        std::cout << \"C \";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["B C ~B", "B ~B C", "B C", "Compiler Error"]),
    correctAnswer: "B ~B C",
    explanation: "When an exception is thrown inside a `try` block, C++ performs \"stack unwinding\". It calls destructors for all fully constructed local objects (`~Base`) BEFORE transferring control to the `catch` block (`C`)."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Integer a = 1000;\n        Integer b = 1000;\n        int c = 1000;\n        System.out.print((a == b) + \" \");\n        System.out.print((a == c));\n    }\n}\n```",
    options: JSON.stringify(["false true", "false false", "true true", "true false"]),
    correctAnswer: "false true",
    explanation: "The Integer cache only works for values -128 to 127. Since 1000 is outside this range, `a` and `b` point to different objects (`a == b` is false). However, when comparing a wrapper (`Integer`) to a primitive (`int`), Java automatically unboxes the wrapper, so `a == c` compares the raw values (`1000 == 1000`), which is true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    int x = 10;\n    public void show() { System.out.print(x + \" \"); }\n}\nclass Derived extends Base {\n    int x = 20;\n    public void show() { System.out.print(x + \" \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Base obj = new Derived();\n        System.out.print(obj.x + \" \");\n        obj.show();\n    }\n}\n```",
    options: JSON.stringify(["10 20", "20 20", "10 10", "20 10"]),
    correctAnswer: "10 20",
    explanation: "In Java, instance variables are NOT overridden; they are hidden. Variable resolution is determined at compile-time by the reference type (`Base`), so `obj.x` yields 10. Methods are overridden and resolved at run-time (dynamic dispatch), so `obj.show()` calls `Derived.show()`, which prints its local `x` (20)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        StringBuilder sb1 = new StringBuilder(\"Java\");\n        StringBuilder sb2 = new StringBuilder(\"Java\");\n        System.out.println(sb1.equals(sb2));\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "false",
    explanation: "Unlike the `String` class, `StringBuilder` and `StringBuffer` do NOT override the `equals()` method from the `Object` class. Therefore, `sb1.equals(sb2)` performs identity comparison (like `==`), and since they are two distinct objects, it returns `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        outer:\n        for (int i = 0; i < 3; i++) {\n            for (int j = 0; j < 3; j++) {\n                if (i == 1 && j == 1) break outer;\n                System.out.print(i + \"\" + j + \" \");\n            }\n        }\n    }\n}\n```",
    options: JSON.stringify(["00 01 02 10 20 21 22", "00 01 02 10", "00 01 02", "Compile Error"]),
    correctAnswer: "00 01 02 10",
    explanation: "Java supports labeled `break` statements. When `i == 1 && j == 1`, `break outer;` completely terminates the outer loop, halting all further execution of both loops. Therefore, only `00`, `01`, `02`, and `10` are printed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Node<T> {\n    T data;\n    public Node(T data) { this.data = data; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Node<String> n1 = new Node<>(\"Test\");\n        Node<Integer> n2 = new Node<>(10);\n        System.out.println(n1.getClass() == n2.getClass());\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "ClassCastException"]),
    correctAnswer: "true",
    explanation: "Due to Java's Type Erasure, generic type information (`<String>`, `<Integer>`) is removed at compile time. At runtime, both objects are simply instances of the raw `Node` class. Thus, their `getClass()` references are identical, evaluating to `true`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        modify(arr);\n        System.out.print(arr[0]);\n    }\n    static void modify(int[] a) {\n        a = new int[]{4, 5, 6};\n    }\n}\n```",
    options: JSON.stringify(["1", "4", "0", "Compile Error"]),
    correctAnswer: "1",
    explanation: "Java is strictly pass-by-value. A copy of the array reference is passed to `modify()`. Reassigning this local reference (`a = new int[]...`) merely points the local variable `a` to a new array; it does not mutate the original array `arr` in `main`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface A {\n    default void show() { System.out.print(\"A\"); }\n}\ninterface B {\n    default void show() { System.out.print(\"B\"); }\n}\nclass C implements A, B {\n    public void show() {\n        A.super.show();\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        new C().show();\n    }\n}\n```",
    options: JSON.stringify(["A", "B", "AB", "Compile Error"]),
    correctAnswer: "A",
    explanation: "This tests the Diamond Problem resolution in Java 8+ interfaces. Because `C` implements two interfaces with the same default method, it must override `show()` to avoid ambiguity. Inside the override, it explicitly invokes `A`'s implementation using `A.super.show()`, printing 'A'."
  },
  // --- BATCH 3: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = { x: 1, y: { z: 2 } };\nconst b = Object.assign({}, a);\nb.x = 10;\nb.y.z = 20;\nconsole.log(a.x, a.y.z);\n```",
    options: JSON.stringify(["1 20", "10 20", "1 2", "10 2"]),
    correctAnswer: "1 20",
    explanation: "`Object.assign` performs a shallow copy. It copies the primitive value `x` completely, so changing `b.x` does not affect `a.x`. However, the nested object `y` is copied by reference. Modifying `b.y.z` also modifies `a.y.z`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = {};\nObject.defineProperty(obj, 'prop', {\n  value: 42,\n  writable: false\n});\nobj.prop = 50;\nconsole.log(obj.prop);\n```",
    options: JSON.stringify(["42", "50", "undefined", "TypeError"]),
    correctAnswer: "42 (or TypeError in strict mode)",
    explanation: "Using `Object.defineProperty` with `writable: false` makes the property read-only. In non-strict mode, reassigning `obj.prop` fails silently and the value remains 42. In strict mode, it would throw a TypeError."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [10, 2, 22, 1];\narr.sort();\nconsole.log(arr);\n```",
    options: JSON.stringify(["[1, 2, 10, 22]", "[10, 2, 22, 1]", "[1, 10, 2, 22]", "Error"]),
    correctAnswer: "[1, 10, 2, 22]",
    explanation: "By default, the `Array.prototype.sort()` method converts all elements to strings and compares their UTF-16 code unit sequences. Lexicographically, '10' comes before '2', resulting in `[1, 10, 2, 22]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(typeof NaN === 'number');\nconsole.log(NaN === NaN);\n```",
    options: JSON.stringify(["true\\nfalse", "false\\nfalse", "true\\ntrue", "false\\ntrue"]),
    correctAnswer: "true\\nfalse",
    explanation: "`NaN` stands for 'Not-A-Number', but its data type according to the ECMAScript spec is technically a numeric data type, so `typeof NaN` is 'number'. However, IEEE 754 specifies that `NaN` is not equal to anything, including itself, so `NaN === NaN` is false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* generate() {\n  yield 1;\n  return 2;\n  yield 3;\n}\nconst gen = generate();\nconsole.log(gen.next().value);\nconsole.log(gen.next().value);\nconsole.log(gen.next().value);\n```",
    options: JSON.stringify(["1\\n2\\n3", "1\\n2\\nundefined", "1\\nundefined\\nundefined", "1\\n3\\nundefined"]),
    correctAnswer: "1\\n2\\nundefined",
    explanation: "The first `next()` yields `1`. The second `next()` encounters the `return 2` statement, which immediately finishes the generator (`done: true`) and sets the `value` to 2. Any subsequent calls to a finished generator will return `undefined` for `value`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nclass Config {\n  static count = 0;\n  static {\n    this.count += 5;\n  }\n}\nconsole.log(Config.count);\n```",
    options: JSON.stringify(["5", "0", "undefined", "SyntaxError"]),
    correctAnswer: "5",
    explanation: "JavaScript supports Class Static Initialization Blocks. The `static {}` block is executed once when the class is initialized. Inside it, `this` refers to the class constructor itself, so `this.count += 5` correctly updates the static property."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [1, 2];\narr.customProp = 'test';\nfor (let i in arr) {\n  console.log(i);\n}\n```",
    options: JSON.stringify(["1\\n2", "0\\n1", "0\\n1\\ncustomProp", "1\\n2\\ntest"]),
    correctAnswer: "0\\n1\\ncustomProp",
    explanation: "The `for...in` loop iterates over all enumerable properties of an object, including inherited ones and custom attached properties. It yields the property keys (indices '0' and '1', and the custom key 'customProp'). To iterate just values, use `for...of`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nvar b = 1;\nfunction outer() {\n  var b = 2;\n  function inner() {\n    b++;\n    var b = 3;\n    console.log(b);\n  }\n  inner();\n}\nouter();\n```",
    options: JSON.stringify(["3", "NaN", "undefined", "4"]),
    correctAnswer: "3",
    explanation: "Inside `inner()`, `var b = 3;` is hoisted to the top of the function. This means the local `b` shadows the outer `b`. Before `b = 3` is assigned, `b` is `undefined`. `b++` evaluates to `NaN`. Then `b` is immediately reassigned to `3`, which is printed."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Point:\n    def __init__(self, x):\n        self.x = x\n    def __eq__(self, other):\n        return self.x == other.x\n\np1 = Point(1)\np2 = Point(1)\ndct = {p1: 'A'}\nprint(dct.get(p2))\n```",
    options: JSON.stringify(["A", "None", "TypeError", "KeyError"]),
    correctAnswer: "TypeError (or Unhashable Type)",
    explanation: "In Python, defining a custom `__eq__` method automatically causes `__hash__` to be set to `None`, making the object unhashable. Trying to use `p1` as a dictionary key throws a `TypeError: unhashable type: 'Point'`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = [1, 2, 3, 4, 5]\nprint(x[::-2])\n```",
    options: JSON.stringify(["[5, 4, 3, 2, 1]", "[5, 3, 1]", "[4, 2]", "[1, 3, 5]"]),
    correctAnswer: "[5, 3, 1]",
    explanation: "Slicing in Python takes the form `[start:stop:step]`. A step of `-2` means it starts from the end of the list and moves backwards, taking every second element. Thus, it grabs 5, skips 4, grabs 3, skips 2, grabs 1."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef dec1(func):\n    def wrap():\n        print(\"1\", end=\"\")\n        func()\n    return wrap\n\ndef dec2(func):\n    def wrap():\n        print(\"2\", end=\"\")\n        func()\n    return wrap\n\n@dec1\n@dec2\ndef say():\n    print(\"3\", end=\"\")\n\nsay()\n```",
    options: JSON.stringify(["123", "321", "213", "132"]),
    correctAnswer: "123",
    explanation: "Decorators are applied from bottom to top. `@dec2` wraps `say` first, then `@dec1` wraps the result. However, execution flows from the outside in (top to bottom). Calling `say()` invokes `dec1`'s wrapper (prints 1), which calls `dec2`'s wrapper (prints 2), which calls the original function (prints 3)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(all([[]]))\nprint(any([[]]))\n```",
    options: JSON.stringify(["True\\nFalse", "False\\nFalse", "True\\nTrue", "False\\nTrue"]),
    correctAnswer: "False\\nFalse",
    explanation: "The list `[[]]` contains one element: an empty list `[]`. Empty lists evaluate to `False` in boolean contexts. `all()` checks if all elements are truthy (False). `any()` checks if at least one element is truthy (False)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\na = {'x': 1, 'y': 2}\nb = {'y': 3, 'z': 4}\nc = {**a, **b}\nprint(c['y'])\n```",
    options: JSON.stringify(["2", "3", "Error", "KeyError"]),
    correctAnswer: "3",
    explanation: "When merging dictionaries via unpacking (`**`), if there are overlapping keys, the value from the rightmost dictionary takes precedence. Thus, `b`'s 'y' value (3) overwrites `a`'s 'y' value (2)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 1\nprint([x for x in range(5)])\nprint(x)\n```",
    options: JSON.stringify(["[0, 1, 2, 3, 4]\\n1", "[0, 1, 2, 3, 4]\\n4", "Error", "[0, 1, 2, 3, 4]\\n5"]),
    correctAnswer: "[0, 1, 2, 3, 4]\\n1",
    explanation: "In Python 3, list comprehensions have their own local scope. The loop variable `x` used inside the comprehension does not leak into or overwrite the global variable `x`, so `x` remains `1` after the comprehension."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    def __str__(self):\n        return \"A\"\nclass B(A):\n    def __repr__(self):\n        return \"B\"\n\nb = B()\nprint(str(b), repr(b))\n```",
    options: JSON.stringify(["A B", "B B", "A A", "Error"]),
    correctAnswer: "A B",
    explanation: "`str(b)` looks for `__str__`. It finds `A.__str__` and returns 'A'. `repr(b)` looks for `__repr__`. It finds `B.__repr__` and returns 'B'. Note: if `__str__` is not defined, `str()` falls back to `__repr__`, but since `__str__` is inherited, it doesn't fall back."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef test():\n    try:\n        raise ValueError()\n    except Exception as e:\n        print(\"E\", end=\"\")\n        raise\n    finally:\n        print(\"F\", end=\"\")\n\ntry:\n    test()\nexcept ValueError:\n    print(\"V\")\n```",
    options: JSON.stringify(["EFV", "EVF", "FV", "EF"]),
    correctAnswer: "EFV",
    explanation: "The `ValueError` is caught by `Exception` (prints 'E'). The `raise` keyword re-raises the exact same `ValueError`. Before control leaves the `test()` function, the `finally` block executes (prints 'F'). Finally, the outer `except ValueError` catches the re-raised exception (prints 'V')."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base { public: virtual ~Base() {} };\nclass Derived : public Base {};\n\nint main() {\n    Base* b = new Base();\n    Derived* d = dynamic_cast<Derived*>(b);\n    std::cout << (d == nullptr);\n    delete b;\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "1",
    explanation: "`dynamic_cast` is used for safe downcasting in polymorphic classes. Since `b` genuinely points to a `Base` object (not a `Derived` object), the cast fails safely and returns a `nullptr`. Thus `(d == nullptr)` evaluates to 1 (true)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Test {\n    int y, x;\npublic:\n    Test() : x(10), y(x + 10) {}\n    void print() { std::cout << x << \" \" << y; }\n};\nint main() {\n    Test t;\n    t.print();\n    return 0;\n}\n```",
    options: JSON.stringify(["10 20", "10 Garbage", "Garbage 20", "Compiler Error"]),
    correctAnswer: "10 Garbage (or Undefined Behavior)",
    explanation: "In an initializer list, members are always initialized in the exact order they are declared in the class, regardless of the order in the initializer list. `y` is declared first, so `y(x + 10)` runs when `x` is uninitialized (garbage). Then `x(10)` runs."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <memory>\nclass A { public: ~A() { std::cout << \"~A \"; } };\nint main() {\n    std::unique_ptr<A> p(new A());\n    p.release();\n    return 0;\n}\n```",
    options: JSON.stringify(["~A", "No output", "Segmentation Fault", "Compiler Error"]),
    correctAnswer: "No output (Memory leak)",
    explanation: "`p.release()` releases ownership of the managed object and returns a raw pointer to it. It does NOT destroy the object. Because the returned raw pointer is ignored and never deleted, the object is leaked and the destructor is never called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void show() = 0;\n};\nclass Derived : public Base {\npublic:\n    void show() { std::cout << \"Derived \"; }\n};\nint main() {\n    Derived d;\n    Base& b = d;\n    b.show();\n    return 0;\n}\n```",
    options: JSON.stringify(["Derived", "Compiler Error", "Segmentation Fault", "Undefined Behavior"]),
    correctAnswer: "Derived",
    explanation: "`Base` is an abstract class because of the pure virtual function `show() = 0`. You cannot instantiate `Base`, but you CAN create pointers or references to it (`Base& b = d;`). Calling `b.show()` executes the overridden `Derived::show()`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A {\npublic:\n    A(const A& other) { std::cout << \"Copy \"; }\n    A& operator=(const A& other) { std::cout << \"Assign \"; return *this; }\n    A() {}\n};\nint main() {\n    A a;\n    A b = a;\n    b = a;\n    return 0;\n}\n```",
    options: JSON.stringify(["Copy Assign", "Assign Assign", "Copy Copy", "Assign Copy"]),
    correctAnswer: "Copy Assign",
    explanation: "`A b = a;` is initialization, so it invokes the Copy Constructor (prints 'Copy'). `b = a;` is assignment to an already existing object, so it invokes the Copy Assignment Operator (prints 'Assign')."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Test {\npublic:\n    void show() { std::cout << \"Test \"; }\n};\nint main() {\n    Test t;\n    void (Test::*ptr)() = &Test::show;\n    (t.*ptr)();\n    return 0;\n}\n```",
    options: JSON.stringify(["Test", "Compiler Error", "Segmentation Fault", "Undefined Behavior"]),
    correctAnswer: "Test",
    explanation: "This demonstrates correct Pointer-to-Member-Function syntax. `&Test::show` takes the address of the member function. It is invoked on the object `t` using the `.*` operator (`(t.*ptr)()`), which successfully prints 'Test'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = 10, b = 20;\n    int* const p = &a;\n    *p = 30;\n    std::cout << a;\n    return 0;\n}\n```",
    options: JSON.stringify(["30", "10", "Compiler Error", "Garbage"]),
    correctAnswer: "30",
    explanation: "`int* const p` declares a constant pointer to a mutable integer. This means the pointer itself cannot be reassigned to point to `b`, but the value it points to (`*p = 30`) can be freely modified. `a` becomes 30."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            int x = 5 / 0;\n        } finally {\n            System.out.print(\"F \");\n        }\n        System.out.print(\"M\");\n    }\n}\n```",
    options: JSON.stringify(["F", "M", "F M", "F ExceptionStackTrace"]),
    correctAnswer: "F ExceptionStackTrace",
    explanation: "Since there is no `catch` block for `ArithmeticException`, the exception propagates outwards. However, before the method abruptly terminates and prints the stack trace, the `finally` block is guaranteed to execute, printing 'F '."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s = \"Java\";\n        modify(s);\n        System.out.println(s);\n    }\n    static void modify(String str) {\n        str += \" 11\";\n    }\n}\n```",
    options: JSON.stringify(["Java", "Java 11", "Compile Error", "Runtime Error"]),
    correctAnswer: "Java",
    explanation: "Strings are immutable in Java. The `+=` operation creates a completely new String object (\"Java 11\") and assigns it to the local variable `str`. The original reference `s` in `main` continues to point to the unchanged \"Java\" string."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(test());\n    }\n    static int test() {\n        int i = 1;\n        try {\n            return i;\n        } finally {\n            i = 2;\n        }\n    }\n}\n```",
    options: JSON.stringify(["1", "2", "Compile Error", "0"]),
    correctAnswer: "1",
    explanation: "When `return i;` executes, the JVM evaluates the expression (which is 1) and temporarily caches this return value. Even though the `finally` block executes and modifies `i` to 2, it does not change the already cached return value."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    public Object get() { return new Object(); }\n}\nclass Derived extends Base {\n    public String get() { return \"Hello\"; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Base obj = new Derived();\n        System.out.println(obj.get().getClass().getSimpleName());\n    }\n}\n```",
    options: JSON.stringify(["String", "Object", "Compile Error", "ClassCastException"]),
    correctAnswer: "String",
    explanation: "This demonstrates Covariant Return Types. A subclass can override a method and change its return type to a subclass of the original return type (`String` is a subclass of `Object`). At runtime, `Derived`'s method is called, returning a `String`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    enum Color { RED, BLUE }\n    public static void main(String[] args) {\n        Color c1 = Color.RED;\n        Color c2 = Color.RED;\n        System.out.print((c1 == c2) + \" \" + (c1.equals(c2)));\n    }\n}\n```",
    options: JSON.stringify(["true true", "false false", "true false", "false true"]),
    correctAnswer: "true true",
    explanation: "Enum values are singletons in Java. Every time you refer to `Color.RED`, you are referencing the exact same static instance in memory. Thus, both identity comparison `==` and value comparison `.equals()` return true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    static void print(int... a) { System.out.print(\"varargs \"); }\n    static void print(int a, int b) { System.out.print(\"exact \"); }\n    \n    public static void main(String[] args) {\n        print(1, 2);\n    }\n}\n```",
    options: JSON.stringify(["exact", "varargs", "Compile Error", "Runtime Error"]),
    correctAnswer: "exact",
    explanation: "When resolving method overloads, Java's compiler looks for the most specific match first. An exact parameter match (`int a, int b`) takes precedence over varargs (`int... a`). Thus, 'exact ' is printed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) throws InterruptedException {\n        Object lock = new Object();\n        lock.wait();\n        System.out.println(\"Done\");\n    }\n}\n```",
    options: JSON.stringify(["Done", "Compile Error", "IllegalMonitorStateException", "InterruptedException"]),
    correctAnswer: "IllegalMonitorStateException",
    explanation: "The `wait()` method must always be called from within a `synchronized` block holding the monitor for that object. Because the main thread does not own `lock`'s monitor when it calls `wait()`, an `IllegalMonitorStateException` is thrown at runtime."
  },
  // --- BATCH 4: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction test() {\n  return\n  {\n    value: 1\n  };\n}\nconsole.log(test());\n```",
    options: JSON.stringify(["{ value: 1 }", "undefined", "SyntaxError", "null"]),
    correctAnswer: "undefined",
    explanation: "This is the classic Automatic Semicolon Insertion (ASI) trap. Because the `return` statement is on its own line, the JavaScript engine automatically inserts a semicolon after it (`return;`). The object literal below it is treated as a separate, unreachable block of code. Therefore, `test()` returns `undefined`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst delay = (ms) => new Promise(res => setTimeout(res, ms));\nasync function run() {\n  let num = 0;\n  [1, 2].forEach(async () => {\n    await delay(10);\n    num++;\n  });\n  console.log(num);\n}\nrun();\n```",
    options: JSON.stringify(["2", "0", "1", "undefined"]),
    correctAnswer: "0",
    explanation: "`Array.prototype.forEach` does not wait for Promises. It synchronously fires off all the async callbacks and immediately moves to the next line. Since the callbacks take 10ms to update `num`, `console.log(num)` runs synchronously while `num` is still 0."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(isNaN('Hello'));\nconsole.log(Number.isNaN('Hello'));\n```",
    options: JSON.stringify(["true\\ntrue", "false\\nfalse", "true\\nfalse", "false\\ntrue"]),
    correctAnswer: "true\\nfalse",
    explanation: "The global `isNaN()` function aggressively coerces the argument to a number first. 'Hello' coerces to `NaN`, so `isNaN('Hello')` is true. `Number.isNaN()`, introduced in ES6, is stricter: it returns true ONLY if the value is strictly the `NaN` type. Since 'Hello' is a string, it returns false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(Math.max());\nconsole.log(Math.min());\n```",
    options: JSON.stringify(["Infinity\\n-Infinity", "-Infinity\\nInfinity", "undefined\\nundefined", "NaN\\nNaN"]),
    correctAnswer: "-Infinity\\nInfinity",
    explanation: "This is deeply unintuitive but correct according to the ECMAScript spec. `Math.max()` without arguments returns `-Infinity` (the lowest possible baseline to start comparing against). `Math.min()` returns `Infinity`. Thus, `Math.min() > Math.max()` evaluates to `true`!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst set = new Set([1, '1', 1, [1], [1]]);\nconsole.log(set.size);\n```",
    options: JSON.stringify(["2", "3", "4", "5"]),
    correctAnswer: "4",
    explanation: "A Set removes duplicates based on the 'SameValueZero' algorithm (which is similar to `===`). The number `1` and string `'1'` are distinct. The duplicate number `1` is removed. However, arrays are compared by reference, not value. The two `[1]` arrays are distinct objects in memory, so both are kept. Total size is 4."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nlet a = 10;\nlet b = new Number(10);\nlet c = 10;\nconsole.log(a === b);\nconsole.log(b === c);\n```",
    options: JSON.stringify(["true\\ntrue", "false\\nfalse", "true\\nfalse", "false\\ntrue"]),
    correctAnswer: "false\\nfalse",
    explanation: "While `a` and `c` are primitive numbers, `b` is an object instantiated with the `new Number()` wrapper. Strict equality (`===`) requires types to match. Since `typeof a` is 'number' and `typeof b` is 'object', the comparison is false in both cases."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst str = 'banana';\nconsole.log(str.replace('a', 'o'));\n```",
    options: JSON.stringify(["bonono", "bonana", "banana", "Error"]),
    correctAnswer: "bonana",
    explanation: "When you pass a string as the first argument to `replace()`, it only replaces the *very first* occurrence it finds. To replace all occurrences, you must use a global regular expression (`/a/g`) or the newer `replaceAll()` method."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = {\n  a: 1,\n  b: 2\n};\nconst p = new Proxy(obj, {\n  get(target, prop) {\n    return target[prop] * 2;\n  }\n});\nconsole.log(p.a);\n```",
    options: JSON.stringify(["1", "2", "undefined", "Error"]),
    correctAnswer: "2",
    explanation: "The Proxy object intercepts the `get` operation. When `p.a` is accessed, the `get` trap is triggered. It returns `target['a'] * 2`, which evaluates to `1 * 2 = 2`."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Container:\n    def __len__(self):\n        return 0\n\nc = Container()\nif c:\n    print(\"True\")\nelse:\n    print(\"False\")\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "False",
    explanation: "When evaluating the truthiness of an object, Python first looks for the `__bool__` method. If it doesn't exist, it falls back to `__len__`. If `__len__` returns 0, the object is considered `False`. Thus, it prints 'False'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntup = (1, 2, [3, 4])\ntry:\n    tup[2] += [5, 6]\nexcept TypeError:\n    pass\nprint(tup)\n```",
    options: JSON.stringify(["(1, 2, [3, 4])", "(1, 2, [3, 4, 5, 6])", "Error", "(1, 2, [3, 4], [5, 6])"]),
    correctAnswer: "(1, 2, [3, 4, 5, 6])",
    explanation: "This is one of Python's most notorious edge cases. `tup[2] += [5, 6]` roughly translates to `tup[2] = tup[2].__iadd__([5, 6])`. The `__iadd__` mutates the list in place (adding 5 and 6). However, the assignment back to `tup[2]` fails because tuples are immutable, throwing a `TypeError`. Because the exception is caught, the mutation survives!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Node:\n    __slots__ = ['val', 'next']\n    def __init__(self, val):\n        self.val = val\n\nn = Node(1)\nn.next = None\nn.prev = None\nprint(n.val)\n```",
    options: JSON.stringify(["1", "None", "AttributeError", "TypeError"]),
    correctAnswer: "AttributeError",
    explanation: "The `__slots__` attribute restricts the dynamic creation of attributes to save memory. You can only assign attributes explicitly listed in `__slots__`. Trying to assign `n.prev = None` throws an `AttributeError` because 'prev' is not in the allowed slots."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = dict.fromkeys(['a', 'b'], [])\nd['a'].append(1)\nprint(d['b'])\n```",
    options: JSON.stringify(["[]", "[1]", "Error", "None"]),
    correctAnswer: "[1]",
    explanation: "`dict.fromkeys()` assigns the *exact same* object reference to all keys. Because the default value is a mutable empty list `[]`, both `d['a']` and `d['b']` point to the same list. Appending to `d['a']` also affects `d['b']`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(0.1 + 0.2 == 0.3)\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "False",
    explanation: "Because of how floating-point numbers are represented in binary (IEEE 754 standard), `0.1 + 0.2` actually evaluates to `0.30000000000000004` in Python (and most languages). Therefore, it is strictly not equal to `0.3`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\na, b = 0, 1\na, b = b, a + b\nprint(a, b)\n```",
    options: JSON.stringify(["1 1", "1 2", "0 1", "Error"]),
    correctAnswer: "1 1",
    explanation: "In Python multiple assignment, the entire right-hand side is evaluated completely *before* any assignments are made to the left-hand side. `b` evaluates to `1`, and `a + b` evaluates to `0 + 1 = 1`. Then, these values are unpacked into `a` and `b` simultaneously."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef outer():\n    x = 10\n    def inner():\n        global x\n        x = 20\n    inner()\n    print(x)\nouter()\n```",
    options: JSON.stringify(["10", "20", "Error", "None"]),
    correctAnswer: "10",
    explanation: "The `global` keyword specifically binds `x` to the global scope (module level), completely bypassing the enclosing `outer()` function scope. Therefore, `inner()` creates or updates a global `x = 20`, but the `print(x)` inside `outer()` still references its local `x = 10`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Test:\n    @classmethod\n    def show(cls):\n        print(cls.__name__)\n\nclass Derived(Test):\n    pass\n\nDerived.show()\n```",
    options: JSON.stringify(["Test", "Derived", "Error", "None"]),
    correctAnswer: "Derived",
    explanation: "Unlike `@staticmethod` which has no knowledge of the class it is called on, `@classmethod` automatically takes the calling class as its first argument (`cls`). Even though it is defined in `Test`, calling it via `Derived` passes `Derived` as the `cls` argument."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base { \npublic: \n    virtual void print() { std::cout << \"Base \"; }\n};\nclass Derived : public Base {\npublic:\n    void print() override { std::cout << \"Derived \"; }\n};\nint main() {\n    try {\n        throw Derived();\n    } catch (Base e) {\n        e.print();\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Base", "Derived", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "Base",
    explanation: "This is the classic Object Slicing problem in exception handling. The exception is caught by value (`catch (Base e)`) instead of by reference (`catch (Base& e)`). The `Derived` object thrown is sliced into a pure `Base` object, so `Base::print()` is invoked."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = 5;\n    int b = 5;\n    std::cout << (++a) << \" \" << (b++);\n    return 0;\n}\n```",
    options: JSON.stringify(["6 5", "6 6", "5 5", "5 6"]),
    correctAnswer: "6 5",
    explanation: "Pre-increment `++a` increments the variable first, then returns the new value (`6`). Post-increment `b++` returns the original value (`5`), and then increments the variable in the background. Thus, it prints `6 5`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nstruct Flags {\n    unsigned int a : 1;\n    unsigned int b : 3;\n};\nint main() {\n    Flags f;\n    f.a = 2;\n    std::cout << f.a;\n    return 0;\n}\n```",
    options: JSON.stringify(["2", "0", "1", "Compiler Warning"]),
    correctAnswer: "0 (Usually triggers a compiler warning)",
    explanation: "The struct uses Bit Fields. The variable `a` is strictly 1 bit wide. It can only hold the values 0 or 1. Trying to assign it 2 (binary `10`) causes overflow. The top bits are truncated, leaving only the lowest bit `0`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A { public: void foo() { std::cout << \"A \"; } };\nclass B : public A {};\nclass C : public A {};\nclass D : public B, public C {};\nint main() {\n    D d;\n    d.foo();\n    return 0;\n}\n```",
    options: JSON.stringify(["A", "AA", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "Compiler Error",
    explanation: "This is the Diamond Inheritance Problem. Because `B` and `C` do not use `virtual` inheritance from `A`, the class `D` inherits two completely distinct copies of `A` (one via `B` and one via `C`). Calling `d.foo()` is ambiguous and fails to compile."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int arr[5];\n    int* ptr = arr;\n    std::cout << (sizeof(arr) > sizeof(ptr));\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1",
    explanation: "Even though arrays naturally decay to pointers when passed to functions, `sizeof` applied directly to an array returns the total byte size of the array (5 * 4 = 20 bytes). `sizeof` applied to a pointer returns the size of the pointer itself (usually 8 bytes). Since 20 > 8, it evaluates to true (1)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nvoid func(const int& x) { std::cout << \"ConstRef \"; }\nvoid func(int&& x) { std::cout << \"RValue \"; }\nint main() {\n    int a = 10;\n    func(a);\n    func(20);\n    return 0;\n}\n```",
    options: JSON.stringify(["ConstRef ConstRef", "ConstRef RValue", "RValue RValue", "Compiler Error"]),
    correctAnswer: "ConstRef RValue",
    explanation: "When passing the l-value `a`, the compiler chooses the l-value reference overload `const int&`. When passing the temporary literal `20`, it strongly prefers the r-value reference overload `int&&`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint x = 5;\nint& getX() {\n    return x;\n}\nint main() {\n    getX() = 10;\n    std::cout << x;\n    return 0;\n}\n```",
    options: JSON.stringify(["5", "10", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "10",
    explanation: "C++ allows functions to return by reference. Since `getX()` returns a reference to the global variable `x`, the function call itself acts as an l-value. Assigning `10` to it directly mutates the global variable `x`."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            throw new RuntimeException(\"Try\");\n        } finally {\n            throw new RuntimeException(\"Finally\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["RuntimeException: Try", "RuntimeException: Finally", "Compile Error", "Try Finally"]),
    correctAnswer: "RuntimeException: Finally",
    explanation: "If an exception is thrown in a `try` block, and another exception is thrown in the `finally` block before the first one is handled, the first exception is completely lost (swallowed). Only the exception from the `finally` block propagates outwards."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String str = null;\n        switch (str) {\n            case \"null\":\n                System.out.println(\"null string\");\n                break;\n            default:\n                System.out.println(\"default\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["null string", "default", "Compile Error", "NullPointerException"]),
    correctAnswer: "NullPointerException",
    explanation: "In Java 7+, you can use Strings in `switch` statements. However, under the hood, the compiler invokes `str.hashCode()` and `str.equals()` to match the cases. Invoking these methods on a `null` reference immediately throws a `NullPointerException`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface A {\n    default boolean equals(Object obj) {\n        return true;\n    }\n}\npublic class Main implements A {\n    public static void main(String[] args) {}\n}\n```",
    options: JSON.stringify(["No output", "Compile Error", "Runtime Error", "true"]),
    correctAnswer: "Compile Error",
    explanation: "A default method in an interface cannot override a method from `java.lang.Object`. The methods `equals`, `hashCode`, and `toString` are already defined in `Object`. Java strictly enforces this to prevent unpredictable resolution hierarchies, resulting in a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Set<Short> set = new HashSet<>();\n        for (short i = 0; i < 5; i++) {\n            set.add(i);\n            set.remove(i - 1);\n        }\n        System.out.println(set.size());\n    }\n}\n```",
    options: JSON.stringify(["1", "5", "4", "Compile Error"]),
    correctAnswer: "5",
    explanation: "The `add(i)` method autoboxes the `short` into a `Short` object. However, `i - 1` performs integer arithmetic, resulting in an `int`. The `remove()` method autoboxes it to an `Integer`. Since `Short` and `Integer` are distinct types in the Set, nothing is ever removed. The final size is 5."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Math.min(Double.MIN_VALUE, 0.0d));\n    }\n}\n```",
    options: JSON.stringify(["0.0", "Double.MIN_VALUE", "Compile Error", "Runtime Error"]),
    correctAnswer: "0.0",
    explanation: "Unlike integer types where `MIN_VALUE` is a large negative number, `Double.MIN_VALUE` is the smallest *positive* nonzero value that can be represented (approximately `4.9E-324`). Therefore, `0.0` is strictly less than `Double.MIN_VALUE`, making it the minimum."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public void method(List<String> list) {}\n    public void method(List<Integer> list) {}\n}\n```",
    options: JSON.stringify(["Compile success", "Compile Error", "Runtime Error", "No output"]),
    correctAnswer: "Compile Error",
    explanation: "Due to Type Erasure, generic type parameters are removed during compilation. Both method signatures erase to `method(List list)`. Java does not allow two methods with the exact same erased signature in the same class, resulting in a 'name clash' compile error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        final int val = 10;\n        Runnable r = new Runnable() {\n            public void run() {\n                System.out.print(val);\n            }\n        };\n        r.run();\n    }\n}\n```",
    options: JSON.stringify(["10", "Compile Error", "Runtime Error", "null"]),
    correctAnswer: "10",
    explanation: "Anonymous inner classes can access local variables of the enclosing method, provided the variables are declared `final` (or in Java 8+, 'effectively final'). Since `val` is final, the inner class captures it successfully and prints 10."
  },
  // --- BATCH 5: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nsetTimeout(() => console.log(1), 0);\nPromise.resolve().then(() => console.log(2));\nqueueMicrotask(() => console.log(3));\nconsole.log(4);\n```",
    options: JSON.stringify(["4 2 3 1", "4 1 2 3", "2 3 4 1", "4 3 2 1"]),
    correctAnswer: "4 2 3 1",
    explanation: "Synchronous code runs first (4). Then, the microtask queue is exhausted. `Promise.then` and `queueMicrotask` both add microtasks in the order they are called (2, then 3). Finally, the macrotask queue is processed, executing `setTimeout` (1)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = Object.create(null);\na.name = 'John';\nconsole.log('name' in a);\nconsole.log(a.hasOwnProperty('name'));\n```",
    options: JSON.stringify(["true\\ntrue", "true\\nError", "false\\nfalse", "false\\nError"]),
    correctAnswer: "true\\nError",
    explanation: "`Object.create(null)` creates an object with NO prototype chain (it does not inherit from `Object.prototype`). While the `in` operator works because 'name' is directly on `a`, calling `a.hasOwnProperty()` throws a TypeError because the method literally does not exist on the object."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  try {\n    yield 1;\n    yield 2;\n  } catch (e) {\n    yield 3;\n  }\n}\nconst g = gen();\nconsole.log(g.next().value);\nconsole.log(g.throw('Err').value);\nconsole.log(g.next().value);\n```",
    options: JSON.stringify(["1\\nErr\\nundefined", "1\\n3\\nundefined", "1\\n3\\n2", "Error"]),
    correctAnswer: "1\\n3\\nundefined",
    explanation: "The first `next()` yields 1 and pauses. `g.throw('Err')` injects an exception into the generator at the paused location. The `catch` block catches it and yields 3. The generator then reaches the end naturally, so the final `next()` yields `undefined`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nlet a = 0;\nlet b = 1;\na ||= 10;\nb &&= 20;\nconsole.log(a, b);\n```",
    options: JSON.stringify(["10 20", "0 20", "10 1", "0 1"]),
    correctAnswer: "10 20",
    explanation: "Logical OR assignment (`||=`) assigns the right value if the left is falsy. `a` is 0 (falsy), so it becomes 10. Logical AND assignment (`&&=`) assigns the right value if the left is truthy. `b` is 1 (truthy), so it becomes 20."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr1 = [1, 2];\nconst arr2 = [3, 4];\nArray.prototype.push.apply(arr1, arr2);\nconsole.log(arr1);\n```",
    options: JSON.stringify(["[1, 2, [3, 4]]", "[1, 2, 3, 4]", "[3, 4, 1, 2]", "Error"]),
    correctAnswer: "[1, 2, 3, 4]",
    explanation: "`apply()` invokes the `push` method with `arr1` as the `this` context, and spreads `arr2` as individual arguments. This efficiently pushes all elements of `arr2` individually into `arr1`, modifying `arr1` in place to `[1, 2, 3, 4]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = { x: 10 };\nconst { x: y = 20, z: w = 30 } = obj;\nconsole.log(y, w);\n```",
    options: JSON.stringify(["10 30", "20 30", "undefined 30", "Error"]),
    correctAnswer: "10 30",
    explanation: "This uses object destructuring with both renaming AND default values. `x: y = 20` means 'extract `x`, rename it to `y`, and default to 20 if `x` is undefined'. Since `x` is 10, `y` becomes 10. `z` is undefined, so `w` defaults to 30."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nasync function foo() {\n  try {\n    return Promise.reject(new Error('fail'));\n  } catch (e) {\n    return 'caught';\n  }\n}\nfoo().catch(e => console.log('outer catch'));\n```",
    options: JSON.stringify(["caught", "outer catch", "Error", "undefined"]),
    correctAnswer: "outer catch",
    explanation: "Returning a rejected Promise directly (without `await`) does NOT throw the error inside the function synchronously. It simply returns the rejected Promise object. Therefore, the inner `catch` is bypassed, and the rejection is caught by the `outer catch`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [{a: 1}, {a: 2}];\narr.map(obj => {\n  obj.a *= 2;\n  return obj;\n});\nconsole.log(arr[0].a);\n```",
    options: JSON.stringify(["1", "2", "undefined", "Error"]),
    correctAnswer: "2",
    explanation: "While `.map()` creates a new array, the objects inside the array are copied by reference. Modifying `obj.a` directly inside the `.map()` callback mutates the original objects residing in memory. Therefore, `arr[0].a` becomes 2."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Desc:\n    def __get__(self, obj, owner):\n        return 42\n    def __set__(self, obj, value):\n        print(\"Read only\")\n\nclass Test:\n    val = Desc()\n\nt = Test()\nt.val = 100\nprint(t.val)\n```",
    options: JSON.stringify(["Read only\\n100", "Read only\\n42", "100", "Error"]),
    correctAnswer: "Read only\\n42",
    explanation: "This implements the Python Descriptor Protocol. Because both `__get__` and `__set__` are defined, it is a data descriptor. When `t.val = 100` is called, `__set__` intercepts it (printing 'Read only'). When `t.val` is accessed, `__get__` always returns 42."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nimport copy\na = [[1, 2], [3, 4]]\nb = copy.copy(a)\nb[0].append(5)\nb.append([6])\nprint(len(a), len(a[0]))\n```",
    options: JSON.stringify(["2 2", "3 3", "2 3", "3 2"]),
    correctAnswer: "2 3",
    explanation: "`copy.copy` creates a shallow copy. The outer list `b` is a new object, so `b.append([6])` doesn't affect `a` (len of `a` remains 2). However, the inner lists are copied by reference. Modifying `b[0]` mutates `a[0]`, so its length becomes 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nvals = [1, 2, 3]\nresult = [x * 2 for x in vals if (y := x) > 1]\nprint(y)\n```",
    options: JSON.stringify(["3", "2", "1", "NameError"]),
    correctAnswer: "3",
    explanation: "Unlike the loop variable `x` in a list comprehension which is strictly scoped to the comprehension (in Python 3), the Walrus Operator `:=` aggressively leaks its assigned variable (`y`) into the enclosing scope. The last evaluated value for `y` is 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef coroutine():\n    yield 1\n    return 10\n\ndef caller():\n    val = yield from coroutine()\n    print(f\"Returned {val}\")\n\nc = caller()\nnext(c)\ntry:\n    next(c)\nexcept StopIteration:\n    pass\n```",
    options: JSON.stringify(["Returned 1", "Returned 10", "Returned None", "Error"]),
    correctAnswer: "Returned 10",
    explanation: "The `yield from` expression delegates generation to the sub-coroutine. When the sub-coroutine finishes and executes a `return` statement, the returned value (10) becomes the evaluation result of the `yield from` expression, which is assigned to `val`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    try:\n        raise ValueError(\"Inner\")\n    except ValueError as e:\n        raise TypeError(\"Outer\") from e\nexcept TypeError as e:\n    print(type(e.__cause__).__name__)\n```",
    options: JSON.stringify(["TypeError", "ValueError", "NoneType", "Error"]),
    correctAnswer: "ValueError",
    explanation: "The `raise ... from ...` syntax is explicit Exception Chaining in Python 3. It assigns the original exception (`e`, which is a `ValueError`) to the `__cause__` attribute of the newly raised `TypeError`. Thus, it prints 'ValueError'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Base:\n    def __init__(self, **kwargs):\n        print(\"Base\")\n        super().__init__(**kwargs)\nclass Mixin:\n    def __init__(self, **kwargs):\n        print(\"Mixin\")\n        super().__init__(**kwargs)\nclass Derived(Base, Mixin):\n    pass\nd = Derived()\n```",
    options: JSON.stringify(["Base", "Mixin", "Base\\nMixin", "Mixin\\nBase"]),
    correctAnswer: "Base\\nMixin",
    explanation: "Python's `super()` follows the Method Resolution Order (MRO), which for `Derived` is `[Derived, Base, Mixin, object]`. Calling `super()` in `Base` does not call `object.__init__`; it calls the NEXT class in the MRO, which is `Mixin`! Thus, both print."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 10\ndef outer():\n    x = 20\n    class Inner:\n        y = x\n    print(Inner.y)\nouter()\n```",
    options: JSON.stringify(["10", "20", "NameError", "AttributeError"]),
    correctAnswer: "20",
    explanation: "Class definitions introduce a new local scope, but they do NOT act like a standard function closure for variable lookups. However, in this case, `x` is evaluated at class definition time within `outer()`. It successfully resolves to the enclosing `x = 20`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nfrom dataclasses import dataclass\n\n@dataclass\nclass Config:\n    flags: list = []\n\nprint(\"Compiled\")\n```",
    options: JSON.stringify(["Compiled", "SyntaxError", "ValueError", "Error: mutable default"]),
    correctAnswer: "ValueError (mutable default)",
    explanation: "Python's `dataclasses` module explicitly forbids assigning mutable default values (like `[]` or `{}`) directly in the class body. It aggressively throws a `ValueError` at definition time. You MUST use `field(default_factory=list)`."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    void show(int x) { std::cout << \"Base \"; }\n};\nclass Derived : public Base {\npublic:\n    void show() { std::cout << \"Derived \"; }\n};\nint main() {\n    Derived d;\n    d.show(5);\n    return 0;\n}\n```",
    options: JSON.stringify(["Base", "Derived", "Compiler Error", "Segmentation Fault"]),
    correctAnswer: "Compiler Error",
    explanation: "This is Name Hiding. By defining a method `show()` in `Derived`, it completely hides ALL methods named `show` in `Base`, regardless of their parameter signatures. To fix this, you must add `using Base::show;` inside `Derived`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A {\npublic:\n    virtual void print() { std::cout << \"A \"; }\n    A() { print(); }\n};\nclass B : public A {\npublic:\n    void print() override { std::cout << \"B \"; }\n    B() { print(); }\n};\nint main() {\n    B obj;\n    return 0;\n}\n```",
    options: JSON.stringify(["A B", "B B", "A A", "Compiler Error"]),
    correctAnswer: "A B",
    explanation: "Calling virtual functions inside a constructor does NOT exhibit polymorphic behavior. While `A` is being constructed, the object is considered to be of type `A` (the vptr points to `A`'s vtable). It prints 'A'. Then `B` finishes construction and prints 'B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <new>\nclass Point {\npublic:\n    int x;\n    Point() : x(5) {}\n};\nint main() {\n    char buffer[sizeof(Point)];\n    Point* p = new (buffer) Point();\n    std::cout << p->x;\n    return 0;\n}\n```",
    options: JSON.stringify(["Garbage", "0", "5", "Compiler Error"]),
    correctAnswer: "5",
    explanation: "This uses Placement `new`. It does not allocate new memory on the heap; instead, it constructs the object `Point` directly in the pre-allocated memory `buffer`. The constructor runs successfully and initializes `x` to 5."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\ntemplate <typename T>\nvoid forwarder(T&& arg) {\n    std::cout << std::is_lvalue_reference<T&&>::value;\n}\nint main() {\n    int x = 10;\n    forwarder(x);\n    forwarder(20);\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "11", "00", "01"]),
    correctAnswer: "10",
    explanation: "This demonstrates Perfect Forwarding and Reference Collapsing rules. When passing l-value `x`, `T` deduces as `int&`, and `int& &&` collapses to `int&` (l-value reference, prints 1). When passing r-value `20`, `T` deduces as `int`, so `int&&` remains an r-value reference (prints 0)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Thrower {\npublic:\n    ~Thrower() { throw 1; }\n};\nint main() {\n    try {\n        Thrower t;\n        throw 2;\n    } catch (...) {\n        std::cout << \"Caught\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Caught", "Segmentation Fault", "Program Terminates", "Compiler Error"]),
    correctAnswer: "Program Terminates (std::terminate called)",
    explanation: "If an exception is thrown (e.g., `throw 2`), C++ begins stack unwinding and calls destructors. If a destructor ALSO throws an exception (`~Thrower`) while another exception is actively propagating, C++ immediately calls `std::terminate()` and crashes."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\ntemplate <typename Derived>\nclass Base {\npublic:\n    void interface() {\n        static_cast<Derived*>(this)->implementation();\n    }\n};\nclass MyClass : public Base<MyClass> {\npublic:\n    void implementation() { std::cout << \"CRTP \"; }\n};\nint main() {\n    MyClass obj;\n    obj.interface();\n    return 0;\n}\n```",
    options: JSON.stringify(["CRTP", "Compiler Error", "Segmentation Fault", "Base"]),
    correctAnswer: "CRTP",
    explanation: "This is the Curiously Recurring Template Pattern (CRTP). It achieves static (compile-time) polymorphism without `virtual` functions or vtables. `Base` downcasts `this` to `Derived` at compile time, safely invoking the implementation in `MyClass`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nconstexpr int square(int x) {\n    return x * x;\n}\nint main() {\n    int a = 5;\n    int b = square(a);\n    std::cout << b;\n    return 0;\n}\n```",
    options: JSON.stringify(["25", "Compiler Error", "Undefined Behavior", "0"]),
    correctAnswer: "25",
    explanation: "Functions marked `constexpr` are evaluated at compile time IF their arguments are constant expressions. Because `a` is a runtime variable, `square(a)` gracefully degrades to a normal runtime function call, calculating and returning 25."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Parent {\n    static { System.out.print(\"1 \"); }\n    { System.out.print(\"2 \"); }\n    Parent() { System.out.print(\"3 \"); }\n}\nclass Child extends Parent {\n    static { System.out.print(\"4 \"); }\n    { System.out.print(\"5 \"); }\n    Child() { System.out.print(\"6 \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        new Child();\n    }\n}\n```",
    options: JSON.stringify(["1 4 2 3 5 6", "1 2 3 4 5 6", "4 1 5 6 2 3", "Compile Error"]),
    correctAnswer: "1 4 2 3 5 6",
    explanation: "Initialization order: 1) Superclass static blocks, 2) Subclass static blocks, 3) Superclass instance blocks, 4) Superclass constructor, 5) Subclass instance blocks, 6) Subclass constructor."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.stream.*;\npublic class Main {\n    public static void main(String[] args) {\n        Stream.generate(() -> 1)\n              .distinct()\n              .limit(5)\n              .forEach(System.out::print);\n    }\n}\n```",
    options: JSON.stringify(["1", "11111", "Infinite Loop", "Compile Error"]),
    correctAnswer: "Infinite Loop",
    explanation: "The stream generates an infinite sequence of 1s. The `distinct()` operation acts as a stateful filter. It allows the first `1` through (printing it). For every subsequent `1`, `distinct()` blocks it. It never reaches the `limit(5)` condition, causing an infinite loop!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Outer {\n    static int x = 10;\n    int y = 20;\n    static class Inner {\n        void show() {\n            System.out.println(x);\n        }\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Outer.Inner inner = new Outer.Inner();\n        inner.show();\n    }\n}\n```",
    options: JSON.stringify(["10", "20", "Compile Error", "Runtime Error"]),
    correctAnswer: "10",
    explanation: "A static nested class does not require an instance of the enclosing class to be instantiated. It can only access static members of the enclosing class directly. Since `x` is static, it prints `10` successfully. If it tried to access `y`, it would fail."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.lang.reflect.*;\nclass Secret {\n    private String data = \"Hidden\";\n}\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Secret s = new Secret();\n        Field f = Secret.class.getDeclaredField(\"data\");\n        f.setAccessible(true);\n        f.set(s, \"Exposed\");\n        System.out.println(f.get(s));\n    }\n}\n```",
    options: JSON.stringify(["Hidden", "Exposed", "IllegalAccessException", "Compile Error"]),
    correctAnswer: "Exposed",
    explanation: "Java Reflection allows you to bypass access modifiers using `setAccessible(true)`. This allows external code to read and modify private fields completely safely (unless blocked by a SecurityManager)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Resurrect {\n    static Resurrect instance;\n    @Override\n    protected void finalize() {\n        instance = this;\n    }\n}\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Resurrect obj = new Resurrect();\n        obj = null;\n        System.gc();\n        Thread.sleep(100);\n        System.out.println(Resurrect.instance != null);\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "This is Object Resurrection. When the GC determines `obj` is unreachable, it calls `finalize()`. Inside `finalize()`, the object assigns its reference `this` to a static root `instance`, making it reachable again. It survives the GC sweep!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        ThreadLocal<Integer> tl = new InheritableThreadLocal<>();\n        tl.set(100);\n        new Thread(() -> {\n            System.out.println(tl.get());\n        }).start();\n    }\n}\n```",
    options: JSON.stringify(["100", "null", "0", "Compile Error"]),
    correctAnswer: "100",
    explanation: "Standard `ThreadLocal` variables are strictly local to the thread that sets them. However, `InheritableThreadLocal` automatically propagates its value to any child threads created by the parent thread. Thus, the new thread inherits and prints `100`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.io.*;\nclass Data implements Serializable {\n    transient int a = 10;\n    int b = 20;\n}\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Data d = new Data();\n        d.a = 50;\n        \n        ByteArrayOutputStream baos = new ByteArrayOutputStream();\n        new ObjectOutputStream(baos).writeObject(d);\n        Data out = (Data) new ObjectInputStream(new ByteArrayInputStream(baos.toByteArray())).readObject();\n        System.out.println(out.a + \" \" + out.b);\n    }\n}\n```",
    options: JSON.stringify(["50 20", "10 20", "0 20", "Compile Error"]),
    correctAnswer: "0 20",
    explanation: "Fields marked with `transient` are completely ignored during Java Serialization. When the object is deserialized, transient fields are initialized to their default values (e.g., `0` for int, `null` for objects), not the value they had or their declaration-time default."
  },
  // --- BATCH 6: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst p1 = Promise.resolve(1);\nconst p2 = Promise.reject(2);\nconst p3 = Promise.resolve(3);\nPromise.allSettled([p1, p2, p3])\n  .then(res => console.log(res[1].status, res[1].value, res[1].reason))\n  .catch(err => console.log('Error'));\n```",
    options: JSON.stringify(["Error", "rejected undefined 2", "rejected 2 undefined", "rejected null 2"]),
    correctAnswer: "rejected undefined 2",
    explanation: "Unlike `Promise.all()`, which short-circuits to the `catch` block on the first rejection, `Promise.allSettled()` waits for ALL promises to finish and always resolves. For a rejected promise, the resulting object has `{ status: 'rejected', reason: 2 }`, but no `value` property."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction multiply(a, b, c) {\n  return a * b * c;\n}\nconst partial = multiply.bind(null, 2, 3);\nconsole.log(partial(4, 5));\n```",
    options: JSON.stringify(["24", "120", "NaN", "Error"]),
    correctAnswer: "24",
    explanation: "This is Partial Application using `bind`. The first argument is `this` (null here). The subsequent arguments (2 and 3) are permanently bound to `a` and `b`. When `partial(4, 5)` is called, `4` binds to `c`, and `5` is ignored. The result is `2 * 3 * 4 = 24`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = {\n  [Symbol.iterator]() {\n    let i = 0;\n    return { next: () => ({ value: ++i, done: i > 2 }) };\n  }\n};\nconsole.log([...obj]);\n```",
    options: JSON.stringify(["[1, 2]", "[1, 2, 3]", "[0, 1, 2]", "Error"]),
    correctAnswer: "[1, 2]",
    explanation: "The spread operator `...` consumes an iterable until `done` is true. The first call returns `{value: 1, done: false}`. The second returns `{value: 2, done: false}`. The third returns `{value: 3, done: true}`. Because `done` is true on the third call, its value (3) is discarded."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst x = 1;\nswitch (x) {\n  case 0:\n    let name = 'Zero';\n    break;\n  case 1:\n    let name = 'One';\n    console.log(name);\n    break;\n}\n```",
    options: JSON.stringify(["One", "Zero", "SyntaxError", "ReferenceError"]),
    correctAnswer: "SyntaxError",
    explanation: "A `switch` statement creates a SINGLE lexical block scope for all of its cases. Declaring `let name` in `case 0` and then again in `case 1` causes a `SyntaxError: Identifier 'name' has already been declared`. To fix this, you must wrap individual cases in `{}` blocks."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(!!0n, !!'', !![], !!{});\n```",
    options: JSON.stringify(["false false true true", "false false false false", "true false true true", "false true true true"]),
    correctAnswer: "false false true true",
    explanation: "The double negation `!!` coerces a value to a boolean. `0n` (BigInt zero) and `''` (empty string) are falsy. However, unlike some other languages, empty arrays `[]` and empty objects `{}` are truthy in JavaScript."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst data = { user: { profile: { id: 42 } } };\nconst { user: { profile: { id: userId } } } = data;\nconsole.log(userId);\nconsole.log(profile);\n```",
    options: JSON.stringify(["42\\nundefined", "42\\nError", "42\\n{id: 42}", "undefined\\nError"]),
    correctAnswer: "42\\nError",
    explanation: "This is deeply nested object destructuring. It drills down to extract `id` and renames it to `userId`. However, the intermediate keys `user` and `profile` are strictly used for pathing—they are NOT declared as variables. Accessing `profile` throws a `ReferenceError`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = ['a', 'b', 'c'];\nconst res = arr.reduceRight((acc, val) => acc + val);\nconsole.log(res);\n```",
    options: JSON.stringify(["abc", "cba", "undefined", "Error"]),
    correctAnswer: "cba",
    explanation: "`reduceRight` works exactly like `reduce`, but iterates over the array from right to left. Without an initial value provided, the accumulator starts as 'c', and it concatenates 'b', then 'a', resulting in 'cba'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(null ?? undefined ?? 'A');\nconsole.log('' || 0 || 'B');\n```",
    options: JSON.stringify(["A\\nB", "undefined\\n0", "null\\nB", "A\\n0"]),
    correctAnswer: "A\\nB",
    explanation: "The Nullish Coalescing operator `??` strictly bypasses `null` and `undefined`, falling back to 'A'. The Logical OR operator `||` bypasses ALL falsy values, including `''` and `0`, falling back to 'B'."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Data:\n    @classmethod\n    @property\n    def info(cls):\n        return \"Info\"\n\nprint(Data.info)\n```",
    options: JSON.stringify(["Info", "<property object>", "Error", "None"]),
    correctAnswer: "<property object> (or Error in older Python versions)",
    explanation: "Chaining `@classmethod` and `@property` is notoriously problematic in Python. While Python 3.9 temporarily supported it, it was deprecated in 3.11 and removed in 3.13 because it fundamentally breaks descriptor logic. In most modern versions, it just prints the unbound property object."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    print(isinstance([1, 2], list[int]))\nexcept TypeError:\n    print(\"TypeError\")\n```",
    options: JSON.stringify(["True", "False", "TypeError", "None"]),
    correctAnswer: "TypeError",
    explanation: "Python's `isinstance()` checks against base classes, not parameterized type hints. The expression `list[int]` is a Generic Alias used for static type checkers (like Mypy). Passing it to `isinstance` at runtime throws a `TypeError: isinstance() argument 2 cannot be a parameterized generic`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ngen = (x * x for x in range(3))\nprint(next(gen))\nprint(list(gen))\n```",
    options: JSON.stringify(["0\\n[0, 1, 4]", "0\\n[1, 4]", "0\\n[]", "Error"]),
    correctAnswer: "0\\n[1, 4]",
    explanation: "A generator expression `(...)` evaluates lazily. The first `next(gen)` computes and consumes `0 * 0 = 0`. When `list(gen)` is called afterwards, it consumes the REMAINING items from the generator, which are `1` and `4`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\narr = [*[1, 2], *[3, 4]]\ndct = {**{'a': 1}, **{'a': 2, 'b': 3}}\nprint(arr, dct)\n```",
    options: JSON.stringify(["[1, 2, 3, 4] {'a': 2, 'b': 3}", "[[1, 2], [3, 4]] {'a': 1, 'b': 3}", "Error", "[[1, 2, 3, 4]] {'a': 1, 'b': 3}"]),
    correctAnswer: "[1, 2, 3, 4] {'a': 2, 'b': 3}",
    explanation: "Python supports unpacking generalizations inside literals. `*` unpacks iterables into a list, flattening them to `[1, 2, 3, 4]`. `**` unpacks dictionaries, with the rightmost dictionary keys overwriting the left ones (`'a': 2`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Meta(type):\n    def __new__(cls, name, bases, dct):\n        dct['x'] = 10\n        return super().__new__(cls, name, bases, dct)\n\nclass Test(metaclass=Meta):\n    pass\n\nprint(Test.x)\n```",
    options: JSON.stringify(["10", "AttributeError", "None", "Error"]),
    correctAnswer: "10",
    explanation: "Metaclasses control class creation. Before the `Test` class is fully instantiated, the metaclass `Meta.__new__` intercepts the creation process and injects the attribute `'x': 10` into the class dictionary. Thus, `Test.x` successfully resolves to 10."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {'a': 1, 'b': 2, 'c': 3}\ntry:\n    for k in d:\n        if k == 'b':\n            del d[k]\n    print(\"Success\")\nexcept RuntimeError:\n    print(\"RuntimeError\")\n```",
    options: JSON.stringify(["Success", "RuntimeError", "KeyError", "None"]),
    correctAnswer: "RuntimeError",
    explanation: "You cannot add or remove keys from a Python dictionary while iterating directly over it. Doing so aggressively throws a `RuntimeError: dictionary changed size during iteration`. To fix this, iterate over a copy of the keys (`list(d.keys())`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\na = (1, 2)\nb = (1, 2)\nprint(id(a) == id(b))\n```",
    options: JSON.stringify(["True", "False", "Implementation Dependent", "Error"]),
    correctAnswer: "Implementation Dependent (Often True in CPython but not guaranteed)",
    explanation: "Unlike small integers or strings, tuples are not strictly interned by the Python language specification. However, CPython aggressively optimizes identical immutable literals in the same code block, pointing them to the same memory address, so it often evaluates to True."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef func(a, b=[]):\n    b.append(a)\n    return b\n\nfunc(1)\nprint(func(2, []))\nprint(func(3))\n```",
    options: JSON.stringify(["[2]\\n[1, 3]", "[1, 2]\\n[1, 2, 3]", "[2]\\n[3]", "[1, 2]\\n[3]"]),
    correctAnswer: "[2]\\n[1, 3]",
    explanation: "The default list `b=[]` is created once. `func(1)` appends 1 to it. `func(2, [])` explicitly passes a NEW empty list, bypassing the default, so it returns `[2]`. `func(3)` falls back to the default list, appending 3 to the previously stored `[1]`, resulting in `[1, 3]`."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <typeinfo>\nclass Base {};\nclass Derived : public Base {};\nint main() {\n    Base* b = new Derived();\n    std::cout << (typeid(*b) == typeid(Derived));\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "0",
    explanation: "Because `Base` has NO virtual functions, it is a non-polymorphic class. RTTI (`typeid`) evaluates non-polymorphic types statically at compile time based on the pointer type (`Base*`), not the actual dynamic object (`Derived`). Thus, it compares `Base` to `Derived`, returning 0."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\ntemplate <typename T>\nvoid func(T t) { std::cout << \"Generic \"; }\n\ntemplate <>\nvoid func(int* t) { std::cout << \"Pointer \"; }\n\nint main() {\n    int x = 5;\n    func(&x);\n    return 0;\n}\n```",
    options: JSON.stringify(["Generic", "Pointer", "Compiler Error", "Generic Pointer"]),
    correctAnswer: "Pointer",
    explanation: "This is Full Template Specialization. The compiler matches the call `func(&x)` (which is `int*`) to the specialized template `<>` for `int*` instead of the generic template `T`. Therefore, 'Pointer ' is printed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\n#include <algorithm>\nint main() {\n    std::vector<int> v = {1, 2, 3, 2, 4};\n    std::remove(v.begin(), v.end(), 2);\n    std::cout << v.size();\n    return 0;\n}\n```",
    options: JSON.stringify(["3", "5", "Compiler Error", "Garbage"]),
    correctAnswer: "5",
    explanation: "The `std::remove` algorithm does NOT actually change the size of the container or delete elements. It merely shifts non-removed elements to the front and returns an iterator to the new logical end. To actually shrink the vector, you must call `v.erase()` with that returned iterator (the Erase-Remove Idiom)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int x = 10;\n    auto lambda = [x]() mutable {\n        x++;\n        std::cout << x << \" \";\n    };\n    lambda();\n    std::cout << x;\n    return 0;\n}\n```",
    options: JSON.stringify(["11 11", "10 10", "11 10", "Compiler Error"]),
    correctAnswer: "11 10",
    explanation: "The lambda captures `x` by value. Normally, captured-by-value variables are read-only (`const`). The `mutable` keyword allows the lambda to modify its internal *copy* of `x` (printing 11). However, the original `x` in `main` remains unchanged (printing 10)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nvoid test() noexcept {\n    throw 1;\n}\nint main() {\n    try {\n        test();\n    } catch (...) {\n        std::cout << \"Caught\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Caught", "Program Terminates", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Program Terminates",
    explanation: "If a function marked `noexcept` throws an exception, the exception does NOT propagate up the call stack to the `catch` block. Instead, the C++ runtime immediately invokes `std::terminate()`, violently ending the program."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass B;\nclass A {\nprivate:\n    int x = 5;\n    friend void show(A&, B&);\n};\nclass B {\nprivate:\n    int y = 10;\n    friend void show(A&, B&);\n};\nvoid show(A& a, B& b) {\n    std::cout << a.x + b.y;\n}\nint main() {\n    A a; B b;\n    show(a, b);\n    return 0;\n}\n```",
    options: JSON.stringify(["15", "Compiler Error", "Segmentation Fault", "Garbage"]),
    correctAnswer: "15",
    explanation: "A single global function `show` can be declared as a `friend` in multiple independent classes. This grants the `show` function unrestricted access to the `private` members of BOTH `A` and `B`, successfully calculating `5 + 10 = 15`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a[5] = {1, 2, 3, 4, 5};\n    int (*p)[5] = &a;\n    std::cout << (*p)[2];\n    return 0;\n}\n```",
    options: JSON.stringify(["3", "Compiler Error", "Segmentation Fault", "Garbage"]),
    correctAnswer: "3",
    explanation: "`int (*p)[5]` declares a pointer to an array of 5 integers (not an array of 5 pointers). Taking the address of the array `&a` matches this type perfectly. Dereferencing it `(*p)` yields the array, and accessing index `[2]` correctly yields `3`."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface A {\n    static void print() { System.out.print(\"A\"); }\n}\nclass B implements A {}\npublic class Main {\n    public static void main(String[] args) {\n        B.print();\n    }\n}\n```",
    options: JSON.stringify(["A", "Compile Error", "Runtime Error", "No output"]),
    correctAnswer: "Compile Error",
    explanation: "Unlike default methods, `static` methods in interfaces are NOT inherited by implementing classes. They belong strictly to the interface itself. Calling `B.print()` causes a compilation error; it must be called as `A.print()`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Outer {\n    int x = 10;\n    class Inner {\n        int x = 20;\n        void show() {\n            System.out.println(Outer.this.x + \" \" + this.x);\n        }\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        new Outer().new Inner().show();\n    }\n}\n```",
    options: JSON.stringify(["10 20", "20 20", "10 10", "Compile Error"]),
    correctAnswer: "10 20",
    explanation: "This demonstrates Variable Shadowing in nested classes. The inner class variable `x` shadows the outer class variable. However, Java provides the syntax `OuterClassName.this.variableName` (e.g., `Outer.this.x`) to explicitly access the hidden outer instance variable."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.concurrent.locks.*;\npublic class Main {\n    public static void main(String[] args) {\n        ReentrantLock lock = new ReentrantLock();\n        lock.lock();\n        lock.lock();\n        System.out.print(lock.getHoldCount());\n        lock.unlock();\n    }\n}\n```",
    options: JSON.stringify(["1", "2", "Deadlock", "IllegalMonitorStateException"]),
    correctAnswer: "2",
    explanation: "`ReentrantLock` allows a thread to acquire the same lock multiple times without deadlocking itself (reentrancy). The `holdCount` increments each time `lock()` is called. Since it was called twice, the hold count is 2. (Note: the thread must eventually call `unlock()` 2 times to release it)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Thread t = new Thread(() -> {\n            try {\n                Thread.sleep(1000);\n            } catch (InterruptedException e) {\n                System.out.print(Thread.currentThread().isInterrupted());\n            }\n        });\n        t.start();\n        t.interrupt();\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "No output"]),
    correctAnswer: "false",
    explanation: "When an `InterruptedException` is thrown by methods like `sleep()`, the JVM automatically clears the interrupted status of the thread. Thus, inside the catch block, `isInterrupted()` evaluates to `false`. To preserve the status, you must manually call `Thread.currentThread().interrupt()` inside the catch block."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String result = String.join(\"-\", \"A\", \"B\", \"C\");\n        System.out.println(result);\n    }\n}\n```",
    options: JSON.stringify(["A-B-C", "A,B,C", "ABC", "Compile Error"]),
    correctAnswer: "A-B-C",
    explanation: "`String.join()` is a utility method introduced in Java 8. It takes a delimiter (in this case, `\"-\"`) and joins the subsequent varargs or iterable elements together using that delimiter, resulting in `A-B-C`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass MyObject {\n    public Object clone() throws CloneNotSupportedException {\n        return super.clone();\n    }\n}\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            MyObject obj = new MyObject();\n            obj.clone();\n            System.out.println(\"Success\");\n        } catch (Exception e) {\n            System.out.println(\"Exception\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Success", "Exception", "Compile Error", "No output"]),
    correctAnswer: "Exception",
    explanation: "Although `MyObject` overrides the `clone()` method, it does NOT implement the `Cloneable` marker interface. When `super.clone()` (which calls `Object.clone()`) realizes the object is not marked as `Cloneable`, it immediately throws a `CloneNotSupportedException`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.function.*;\npublic class Main {\n    public static void main(String[] args) {\n        Supplier<String> supplier = () -> {\n            throw new Exception(\"Error\");\n        };\n        System.out.println(\"Done\");\n    }\n}\n```",
    options: JSON.stringify(["Done", "Compile Error", "Runtime Error", "Error"]),
    correctAnswer: "Compile Error",
    explanation: "Lambda expressions cannot throw Checked Exceptions unless the functional interface they are implementing explicitly declares them in its `throws` clause. `Supplier.get()` does not throw any checked exceptions, so attempting to throw `Exception` inside the lambda fails to compile."
  },
  // --- BATCH 7: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction tag(strings, ...values) {\n  return strings[1] + values[0];\n}\nconsole.log(tag`Hello ${10} World`);\n```",
    options: JSON.stringify(["10 World", " World10", "Hello10", "Error"]),
    correctAnswer: " World10",
    explanation: "This is a Tagged Template Literal. The `strings` array contains the literal string pieces `['Hello ', ' World']`. The `values` array contains the evaluated expressions `[10]`. `strings[1]` is `' World'`, and `values[0]` is `10`. Thus it returns `' World10'`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst map = new WeakMap();\ntry {\n  map.set('key', 100);\n  console.log(map.get('key'));\n} catch (e) {\n  console.log('Error');\n}\n```",
    options: JSON.stringify(["100", "undefined", "Error", "null"]),
    correctAnswer: "Error",
    explanation: "A `WeakMap` strictly requires its keys to be objects (or non-registered Symbols). Primitive values like strings (`'key'`) or numbers are completely forbidden because they cannot be garbage collected. Attempting to use a string as a key throws a `TypeError`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = { a: 1 };\nObject.seal(obj);\nobj.a = 2;\nobj.b = 3;\ndelete obj.a;\nconsole.log(obj);\n```",
    options: JSON.stringify(["{ a: 1 }", "{ a: 2 }", "{ a: 2, b: 3 }", "Error"]),
    correctAnswer: "{ a: 2 }",
    explanation: "`Object.seal()` prevents adding new properties and prevents deleting existing properties, but ALLOWS modifying the values of existing properties. `obj.a` becomes 2, `obj.b` fails silently (or throws in strict mode), and `delete obj.a` fails silently."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst sym = Symbol('id');\nconst obj = { [sym]: 1, name: 'John' };\nconsole.log(Object.keys(obj).length, Reflect.ownKeys(obj).length);\n```",
    options: JSON.stringify(["2 2", "1 1", "1 2", "2 1"]),
    correctAnswer: "1 2",
    explanation: "`Object.keys()` completely ignores Symbol properties, so it only finds `'name'` (length 1). `Reflect.ownKeys()` returns an array of ALL keys on the object, including both strings and Symbols, so it finds both (length 2)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(delete Math.PI);\nconsole.log(delete nonexistent);\n```",
    options: JSON.stringify(["false\\nfalse", "false\\ntrue", "true\\ntrue", "Error"]),
    correctAnswer: "false\\ntrue",
    explanation: "The `delete` operator returns `false` if it attempts to delete a non-configurable property (like `Math.PI`). Paradoxically, it returns `true` when deleting a property that does not exist at all, because the 'deletion' was technically successful."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = {\n  fn: function() {\n    return () => this;\n  }\n};\nconst detached = obj.fn;\nconsole.log(detached()() === obj);\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "false",
    explanation: "Arrow functions capture `this` from their lexical scope at the time they are created. `obj.fn` is detached and called without a context (`detached()`), so its internal `this` is `undefined` (or `window`). The inner arrow function captures that `undefined` context."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([...'AB', ...{0: 'C', 1: 'D'}]);\n```",
    options: JSON.stringify(["['A', 'B', 'C', 'D']", "['A', 'B']", "Error", "['A', 'B', undefined, undefined]"]),
    correctAnswer: "Error",
    explanation: "Strings are iterable, so `...'AB'` spreads to `'A', 'B'`. However, plain objects are NOT iterable by default (they lack a `[Symbol.iterator]`). Attempting to spread a plain object inside an array literal throws a `TypeError: object is not iterable`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nPromise.race([]).then(() => console.log('Resolved')).catch(() => console.log('Rejected'));\nconsole.log('Sync');\n```",
    options: JSON.stringify(["Resolved\\nSync", "Rejected\\nSync", "Sync", "Error"]),
    correctAnswer: "Sync",
    explanation: "`Promise.race()` resolves or rejects as soon as the first promise in the iterable settles. If the iterable is empty `[]`, it has nothing to wait for, so it hangs in a pending state FOREVER. Only the synchronous code ('Sync') executes."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    def __new__(cls):\n        return object.__new__(B)\n    def __init__(self):\n        print(\"Init A\")\n\nclass B:\n    def __init__(self):\n        print(\"Init B\")\n\nA()\n```",
    options: JSON.stringify(["Init A", "Init B", "Init A\\nInit B", "No output"]),
    correctAnswer: "No output",
    explanation: "If `__new__` returns an instance of a *different* class than the one it was called on, Python will completely skip calling `__init__`. Since `A.__new__` returns a `B` object, neither `A.__init__` nor `B.__init__` is automatically invoked."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\narr = [3, 1, 2]\nres = arr.sort()\nprint(res)\n```",
    options: JSON.stringify(["[1, 2, 3]", "[3, 1, 2]", "None", "Error"]),
    correctAnswer: "None",
    explanation: "The `list.sort()` method mutates the list in place and deliberately returns `None` to prevent users from mistakenly treating it as returning a new list. If you want a new sorted list returned, you must use the global `sorted(arr)` function."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nfrom collections import defaultdict\ntry:\n    d = defaultdict(0)\n    print(d['a'])\nexcept TypeError:\n    print(\"TypeError\")\n```",
    options: JSON.stringify(["0", "TypeError", "KeyError", "None"]),
    correctAnswer: "TypeError",
    explanation: "`defaultdict` requires a *callable* object (like `int`, `list`, or a lambda) as its default factory, not a raw value. Passing the integer `0` instead of `int` causes a `TypeError: first argument must be callable or None`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef my_gen():\n    try:\n        yield 1\n    except GeneratorExit:\n        print(\"Exiting\")\n\ng = my_gen()\nnext(g)\ng.close()\n```",
    options: JSON.stringify(["1\\nExiting", "Exiting", "1", "Error"]),
    correctAnswer: "Exiting (with 1 being consumed silently by next())",
    explanation: "When you call `close()` on a generator, Python injects a `GeneratorExit` exception precisely at the point where the generator is paused (`yield 1`). The generator catches it and prints 'Exiting'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nimport sys\na = \"hello world\"\nb = \"hello world\"\nprint(a is b)\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "False (Usually in standard REPL)",
    explanation: "While short strings without spaces (like 'hello') are usually interned automatically by Python, strings with spaces or special characters are generally not interned unless explicitly requested via `sys.intern()`. Therefore, `a is b` evaluates to False."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 10\ndef test():\n    print(x)\n    x = 20\n\ntest()\n```",
    options: JSON.stringify(["10", "20", "UnboundLocalError", "NameError"]),
    correctAnswer: "UnboundLocalError",
    explanation: "Because `x = 20` is assigned inside the function, Python's compiler statically analyzes `x` as a LOCAL variable for the entire scope of `test()`. The `print(x)` on the previous line fails because the local variable `x` is referenced before it has been assigned."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {k: v for k, v in zip(['a', 'b'], [1, 2])}\nprint(d)\n```",
    options: JSON.stringify(["{'a': 1, 'b': 2}", "{'a': 2, 'b': 1}", "Error", "None"]),
    correctAnswer: "{'a': 1, 'b': 2}",
    explanation: "This is a standard dictionary comprehension using `zip`. `zip` pairs elements from both iterables in order. The first pair is `('a', 1)`, the second is `('b', 2)`. It creates the dictionary successfully."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = (1, 2, 3)\nprint(x[1:0:-1])\n```",
    options: JSON.stringify(["(2,)", "(2, 1)", "(3, 2)", "Error"]),
    correctAnswer: "(2,)",
    explanation: "The slice `[start:stop:step]` has a step of `-1` (reversed). It starts at index 1 (value 2), and stops BEFORE index 0. Therefore, only the value at index 1 is included, resulting in a single-element tuple `(2,)`."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <utility>\nclass A {\npublic:\n    A() {} \n    A(const A&) { std::cout << \"Copy \"; }\n    A(A&&) { std::cout << \"Move \"; }\n};\nint main() {\n    const A obj;\n    A obj2(std::move(obj));\n    return 0;\n}\n```",
    options: JSON.stringify(["Move", "Copy", "Compiler Error", "Garbage"]),
    correctAnswer: "Copy",
    explanation: "`std::move` casts `obj` to an r-value reference (`const A&&`). However, the move constructor expects a NON-const r-value reference (`A&&`) so it can steal its resources. Because it's `const`, the move constructor is disqualified, and the compiler gracefully falls back to the copy constructor (`const A&`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = (1, 2, 3);\n    int b = 1, 2, 3;\n    std::cout << a << \" \" << b;\n    return 0;\n}\n```",
    options: JSON.stringify(["3 3", "3 1", "Compiler Error", "1 1"]),
    correctAnswer: "Compiler Error",
    explanation: "While `int a = (1, 2, 3);` uses the comma operator effectively (evaluating all and assigning the rightmost `3` to `a`), the syntax `int b = 1, 2, 3;` is interpreted as declaring multiple variables. It tries to declare variables named `2` and `3`, causing a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <future>\nvoid background() { std::cout << \"Task \"; }\nint main() {\n    std::async(std::launch::async, background);\n    std::cout << \"Main \";\n    return 0;\n}\n```",
    options: JSON.stringify(["Main Task", "Task Main", "Main", "Undefined"]),
    correctAnswer: "Task Main",
    explanation: "`std::async` returns a `std::future`. If this returned `future` is not captured into a variable, it is immediately destroyed as a temporary object. The destructor of a `std::future` returned by `std::async` BLOCKS until the task finishes. Thus, it acts synchronously, printing 'Task Main'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<bool> v = {true, false};\n    auto& ref = v[0];\n    std::cout << ref;\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Compiler Error",
    explanation: "`std::vector<bool>` is notoriously specialized to optimize memory by packing booleans as bits. Because you cannot return a reference to a single bit, `v[0]` returns a proxy object, not a `bool&`. Attempting to bind a non-const l-value reference `auto&` to this temporary proxy object fails to compile."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nnamespace {\n    int hidden = 42;\n}\nint main() {\n    std::cout << hidden;\n    return 0;\n}\n```",
    options: JSON.stringify(["42", "Compiler Error", "Linker Error", "Garbage"]),
    correctAnswer: "42",
    explanation: "This uses an Unnamed (Anonymous) Namespace. Any variables or functions defined inside an anonymous namespace are fully accessible within that translation unit (file), but are given internal linkage, hiding them completely from other C++ files (similar to the `static` keyword in C)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <type_traits>\ntemplate <typename T>\ntypename std::enable_if<std::is_integral<T>::value, void>::type \nfunc(T t) { std::cout << \"Int\"; }\nint main() {\n    func(5.5);\n    return 0;\n}\n```",
    options: JSON.stringify(["Int", "Compiler Error", "Garbage", "0"]),
    correctAnswer: "Compiler Error",
    explanation: "This demonstrates SFINAE (`std::enable_if`). The function template is ONLY valid for integral types. Since `5.5` is a `double`, the template fails to substitute. Because no valid fallback function exists for `double`, it causes a compilation error (no matching function to call)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base { virtual void dummy() {} };\nclass Derived1 : virtual public Base {};\nclass Derived2 : virtual public Base {};\nclass Final : public Derived1, public Derived2 {};\nint main() {\n    std::cout << (sizeof(Final) > sizeof(Base));\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1",
    explanation: "This uses Virtual Inheritance to solve the Diamond Problem. To achieve this, the compiler inserts hidden virtual base pointers (vbptr) into the derived classes to track the single shared instance of `Base`. These extra pointers increase the `sizeof` the `Final` class, making it larger than `Base`."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s1 = new String(\"hello\");\n        String s2 = \"hello\";\n        String s3 = s1.intern();\n        System.out.print((s1 == s2) + \" \" + (s2 == s3));\n    }\n}\n```",
    options: JSON.stringify(["false true", "true true", "false false", "true false"]),
    correctAnswer: "false true",
    explanation: "`s1` is a new object on the heap, so `s1 == s2` is false. However, `s1.intern()` searches the String Constant Pool for 'hello', finds `s2`, and returns a reference to it. Therefore, `s3` points to the exact same pool instance as `s2`, making `s2 == s3` true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Parent {\n    static int val = 10;\n}\nclass Child extends Parent {\n    static int val = 20;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.println(p.val);\n    }\n}\n```",
    options: JSON.stringify(["10", "20", "Compile Error", "Runtime Error"]),
    correctAnswer: "10",
    explanation: "Static variables are NOT polymorphic. They are resolved strictly at compile time based on the REFERENCE type, not the object type. Since the reference `p` is of type `Parent`, it directly accesses `Parent.val` (10)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3));\n        for (int i : list) {\n            if (i == 2) list.remove(Integer.valueOf(2));\n        }\n        System.out.println(list.size());\n    }\n}\n```",
    options: JSON.stringify(["2", "3", "ConcurrentModificationException", "Compile Error"]),
    correctAnswer: "ConcurrentModificationException",
    explanation: "The enhanced `for` loop uses an `Iterator` under the hood. Calling `list.remove()` directly on the array list (instead of via the iterator) increments the internal `modCount`. The iterator notices this modification on the next loop and throws a `ConcurrentModificationException` to fail fast."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = Collections.unmodifiableList(new ArrayList<>(Arrays.asList(1, 2)));\n        list.set(0, 5);\n        System.out.println(list.get(0));\n    }\n}\n```",
    options: JSON.stringify(["5", "UnsupportedOperationException", "Compile Error", "1"]),
    correctAnswer: "UnsupportedOperationException",
    explanation: "`Collections.unmodifiableList()` returns a wrapper that intercepts all mutating methods (`add`, `set`, `remove`, etc.) and immediately throws an `UnsupportedOperationException`. It cannot be altered."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void print(Object o) {\n        System.out.print(\"Object\");\n    }\n    public static void print(String s) {\n        System.out.print(\"String\");\n    }\n    public static void main(String[] args) {\n        print(null);\n    }\n}\n```",
    options: JSON.stringify(["Object", "String", "Compile Error", "NullPointerException"]),
    correctAnswer: "String",
    explanation: "When resolving overloaded methods with a `null` argument, Java selects the most specific type. Since `String` is a subclass of `Object`, it is considered more specific. Thus, the `print(String)` overload is successfully executed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    private static volatile int count = 0;\n    public static void main(String[] args) throws Exception {\n        Thread t1 = new Thread(() -> count++);\n        Thread t2 = new Thread(() -> count++);\n        t1.start(); t2.start();\n        t1.join(); t2.join();\n        System.out.print(count > 0);\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "While the `volatile` keyword guarantees memory visibility across threads, it does NOT guarantee atomicity for compound operations like `count++` (which is read-modify-write). However, since the threads perform increments, the final count will be either 1 or 2, both of which are strictly > 0."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        int day = 2;\n        int result = switch (day) {\n            case 1, 2 -> 10;\n            default -> 0;\n        };\n        System.out.println(result);\n    }\n}\n```",
    options: JSON.stringify(["10", "0", "Compile Error", "NullPointerException"]),
    correctAnswer: "10",
    explanation: "This uses the Java 14+ Switch Expression syntax (`->`). It evaluates to a value directly. The input `day = 2` matches the `case 1, 2` block, which immediately yields `10` and assigns it to `result`. No `break` statements are necessary."
  },
  // --- BATCH 8: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(9007199254740992 === 9007199254740993);\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "true",
    explanation: "JavaScript numbers are represented as 64-bit floating-point numbers (IEEE 754). The maximum safely representable integer (`Number.MAX_SAFE_INTEGER`) is 9007199254740991. Beyond this, precision is lost. 9007199254740993 is rounded down in memory to 9007199254740992, making the strict equality check evaluate to true. To avoid this, use BigInt (`9007199254740993n`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\ntry {\n  throw new Error('Fail');\n} catch {\n  console.log('Caught');\n}\n```",
    options: JSON.stringify(["Caught", "SyntaxError", "ReferenceError", "Fail"]),
    correctAnswer: "Caught",
    explanation: "Starting in ES2019, JavaScript supports Optional Catch Binding. This allows you to completely omit the error variable in the `catch` clause (i.e., `catch` instead of `catch(e)`) if you don't intend to use the error object. It compiles and prints 'Caught'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nclass User {\n  #password = 'secret';\n  getPassword() { return this.#password; }\n}\nconst u = new User();\nconsole.log(u.#password);\n```",
    options: JSON.stringify(["secret", "undefined", "SyntaxError", "null"]),
    correctAnswer: "SyntaxError",
    explanation: "The `#` prefix defines a truly private class field in modern JavaScript. Unlike the `_` convention (which is just a suggestion), `#` enforces privacy strictly at the language engine level. Attempting to access it from outside the class throws a `SyntaxError: Private field '#password' must be declared in an enclosing class`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [1, 2, , 4];\nconsole.log(arr.flat().length);\n```",
    options: JSON.stringify(["4", "3", "undefined", "Error"]),
    correctAnswer: "3",
    explanation: "The `Array.prototype.flat()` method naturally removes all empty slots (holes) in sparse arrays, even if you are just flattening depth 1. The hole at index 2 is completely discarded, leaving `[1, 2, 4]`, which has a length of 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction test(a, b = 2, c) {}\nconsole.log(test.length);\n```",
    options: JSON.stringify(["3", "2", "1", "0"]),
    correctAnswer: "1",
    explanation: "The `Function.length` property indicates the number of parameters expected by the function. Crucially, it only counts parameters UP TO the first one that has a default value (or a rest parameter). Since `b` has a default value, it stops counting at `a`. Thus, the length is 1."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  yield* [1, 2];\n  yield 3;\n}\nconsole.log([...gen()]);\n```",
    options: JSON.stringify(["[[1, 2], 3]", "[1, 2, 3]", "[1, 3]", "Error"]),
    correctAnswer: "[1, 2, 3]",
    explanation: "The `yield*` operator delegates yielding to another iterable object (in this case, the array `[1, 2]`). It effectively 'flattens' the iterable into the generator's output sequence. The spread operator consumes this sequence as `1, 2, 3`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst str = 'test';\nconst iterator = str.matchAll(/t/g);\nconsole.log(Array.isArray(iterator));\n```",
    options: JSON.stringify(["true", "false", "undefined", "Error"]),
    correctAnswer: "false",
    explanation: "`String.prototype.matchAll()` does NOT return an Array like `match()` does. It returns a RegExpStringIterator. To get an array, you must spread it `[...str.matchAll(/t/g)]` or use `Array.from()`. Thus, `Array.isArray` returns false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = Array.from({ length: 3 }, (v, i) => i * 2);\nconsole.log(arr);\n```",
    options: JSON.stringify(["[0, 2, 4]", "[undefined, undefined, undefined]", "Error", "[0, 0, 0]"]),
    correctAnswer: "[0, 2, 4]",
    explanation: "`Array.from()` accepts an array-like object (like `{ length: 3 }`) as its first argument and an optional mapping function as its second. It creates an array of length 3, and maps each index `i` to `i * 2`, producing `[0, 2, 4]`."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef test():\n    x = 10\n    locals()['x'] = 20\n    print(x)\ntest()\n```",
    options: JSON.stringify(["20", "10", "Error", "None"]),
    correctAnswer: "10",
    explanation: "Unlike `globals()` which returns the actual global dictionary, `locals()` returns a *copy* of the current local namespace (or it's heavily restricted from writing back to the fast local variable slots). Modifying the dictionary returned by `locals()` does NOT alter the actual local variable `x`. It prints 10."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nimport sys\ndef test():\n    print(sys.getrefcount(\"TestString123\"))\ntest()\n```",
    options: JSON.stringify(["1", "2", "3", "0"]),
    correctAnswer: "2 (or higher)",
    explanation: "`sys.getrefcount()` always returns a count that is at least one higher than you expect. This is because passing the object as an argument to the `getrefcount()` function itself creates a temporary reference to the object on the call stack."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    pass\nexcept:\n    print(\"Except\")\nelse:\n    print(\"Else\")\nfinally:\n    print(\"Finally\")\n```",
    options: JSON.stringify(["Finally", "Else\\nFinally", "Except\\nFinally", "None"]),
    correctAnswer: "Else\\nFinally",
    explanation: "The `else` block in a `try...except` statement executes ONLY if no exception was raised in the `try` block. Since `pass` raises no exception, 'Else' prints. The `finally` block ALWAYS executes, so 'Finally' prints after."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\narr = [1, 2, 3, 4]\narr[1:3] = [10, 20, 30]\nprint(len(arr))\n```",
    options: JSON.stringify(["4", "5", "3", "Error"]),
    correctAnswer: "5",
    explanation: "When you assign an iterable to a list slice, Python replaces that slice with the elements of the iterable. The slice `[1:3]` targets 2 elements (`[2, 3]`). We replace them with 3 elements (`[10, 20, 30]`). The array grows to accommodate them: `[1, 10, 20, 30, 4]`. The new length is 5."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(2 ** 3 ** 2)\n```",
    options: JSON.stringify(["64", "512", "Error", "None"]),
    correctAnswer: "512",
    explanation: "In Python, the exponentiation operator `**` evaluates right-to-left (it is right-associative). Therefore, `2 ** 3 ** 2` is evaluated as `2 ** (3 ** 2)`, which is `2 ** 9`, equaling 512."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndict1 = {'a': 1, 'b': 2}\ndict2 = {'b': 3, 'c': 4}\nres = dict1 | dict2\nprint(res['b'])\n```",
    options: JSON.stringify(["2", "3", "Error", "None"]),
    correctAnswer: "3",
    explanation: "Introduced in Python 3.9, the `|` operator performs dictionary merging. When keys collide (like 'b'), the value from the right-hand dictionary (`dict2`) overwrites the value from the left-hand dictionary. Thus, 'b' becomes 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Cycle:\n    def __init__(self):\n        self.ref = self\n    def __del__(self):\n        print(\"Del\")\n\nc = Cycle()\ndel c\n```",
    options: JSON.stringify(["Del", "Error", "No output", "Del\\nDel"]),
    correctAnswer: "No output (Usually)",
    explanation: "The object `c` contains a circular reference to itself (`self.ref = self`). Calling `del c` removes the variable `c` from the local scope, but the object's reference count does NOT reach 0 because it still references itself. `__del__` is not called until the Garbage Collector's cyclic detector runs (which may not happen before the script exits)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code in CPython?\n```python\na = 256\nb = 256\nc = 257\nd = 257\nprint((a is b), (c is d))\n```",
    options: JSON.stringify(["True True", "False False", "True False", "False True"]),
    correctAnswer: "True False (Often, though REPL dependent)",
    explanation: "In CPython, small integers between -5 and 256 are heavily cached/interned to save memory. Both `a` and `b` point to the exact same cached integer object in memory. However, 257 is outside this range, so `c` and `d` are often allocated as distinct objects with different memory addresses."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v;\n    v.reserve(10);\n    std::cout << v.size();\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "0", "Garbage", "Compiler Error"]),
    correctAnswer: "0",
    explanation: "`std::vector::reserve(10)` allocates enough memory capacity to hold 10 elements without reallocating, but it does NOT actually create those elements or change the logical size of the vector. The `size()` remains 0. (To change size, use `resize()`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = 4.5;\n    int b{4.5};\n    std::cout << a;\n    return 0;\n}\n```",
    options: JSON.stringify(["4", "Compiler Error", "4.5", "Undefined Behavior"]),
    correctAnswer: "Compiler Error",
    explanation: "C++11 introduced Uniform Initialization with braces `{}`. One of its main features is that it strictly prevents Narrowing Conversions. While `int a = 4.5` silently truncates to 4, `int b{4.5}` throws a compiler error because information is lost."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    auto lambda = []() -> int {\n        return 5.9;\n    };\n    std::cout << lambda();\n    return 0;\n}\n```",
    options: JSON.stringify(["5.9", "5", "6", "Compiler Error"]),
    correctAnswer: "5",
    explanation: "The lambda uses a trailing return type `-> int`. When it returns the `double` `5.9`, the compiler implicitly casts it to match the declared return type `int`, truncating it to `5`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void print(int x = 10) { std::cout << \"Base: \" << x; }\n};\nclass Derived : public Base {\npublic:\n    void print(int x = 20) override { std::cout << \"Derived: \" << x; }\n};\nint main() {\n    Base* ptr = new Derived();\n    ptr->print();\n    return 0;\n}\n```",
    options: JSON.stringify(["Base: 10", "Derived: 20", "Derived: 10", "Base: 20"]),
    correctAnswer: "Derived: 10",
    explanation: "This is a classic C++ trap! Virtual functions are bound DYNAMICALLY at runtime, but default arguments are bound STATICALLY at compile time based on the pointer type. The pointer is `Base*`, so the compiler injects the default argument `10`. The runtime dispatches the call to `Derived::print`, resulting in 'Derived: 10'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <tuple>\nint main() {\n    std::tuple<int, double> t(1, 2.5);\n    auto [x, y] = t;\n    x = 10;\n    std::cout << std::get<0>(t);\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "1", "Compiler Error", "Garbage"]),
    correctAnswer: "1",
    explanation: "C++17 Structured Binding `auto [x, y] = t` unpacks the tuple into variables `x` and `y` BY VALUE (because `auto` is used, not `auto&`). Modifying `x` only modifies the local copy, leaving the original tuple `t` unchanged at `1`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <memory>\nstruct CustomDeleter {\n    void operator()(int* p) const { delete p; }\n};\nint main() {\n    std::unique_ptr<int> p1(new int(5));\n    std::unique_ptr<int, CustomDeleter> p2(new int(5));\n    std::cout << (sizeof(p1) == sizeof(p2));\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1",
    explanation: "A custom deleter is part of `std::unique_ptr`'s type signature. However, because `CustomDeleter` is an empty struct (no state), most compilers use Empty Base Class Optimization (EBCO). The custom deleter adds 0 bytes of overhead, so `sizeof(p1)` equals `sizeof(p2)` (usually 8 bytes)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int* ptr = new int[10];\n    delete ptr;\n    std::cout << \"Done\";\n    return 0;\n}\n```",
    options: JSON.stringify(["Done", "Compiler Error", "Memory Leak", "Undefined Behavior"]),
    correctAnswer: "Undefined Behavior (often leading to Memory Leak or Crash)",
    explanation: "Memory allocated with array `new[]` MUST be deallocated with array `delete[]`. Using standard `delete` on an array pointer is strictly Undefined Behavior in C++. It typically fails to call destructors for elements 1 through 9, and corrupts the heap."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    static void process(long x) { System.out.print(\"long \"); }\n    static void process(Integer x) { System.out.print(\"Integer \"); }\n    public static void main(String[] args) {\n        int val = 5;\n        process(val);\n    }\n}\n```",
    options: JSON.stringify(["long", "Integer", "Compile Error", "Runtime Error"]),
    correctAnswer: "long",
    explanation: "In Java Method Overloading resolution, primitive Widening (converting `int` to `long`) takes strict precedence over Autoboxing (converting `int` to `Integer`). Therefore, `process(long)` is selected over `process(Integer)`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Parent {\n    void execute() throws java.io.IOException {}\n}\nclass Child extends Parent {\n    void execute() throws Exception {}\n}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Compiled\");\n    }\n}\n```",
    options: JSON.stringify(["Compiled", "Compile Error", "Runtime Error", "No output"]),
    correctAnswer: "Compile Error",
    explanation: "When overriding a method in Java, the overriding method in the child class cannot throw a broader (more generic) Checked Exception than the overridden method in the parent class. Since `Exception` is broader than `IOException`, it fails to compile."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(1 + 2 + \"3\" + 4 + 5);\n    }\n}\n```",
    options: JSON.stringify(["12345", "3345", "339", "15"]),
    correctAnswer: "3345",
    explanation: "String concatenation evaluates strictly from left to right. First, `1 + 2` is arithmetic (`3`). Then `3 + \"3\"` concatenates into the string `\"33\"`. From that point on, everything is string concatenation. `\"33\" + 4` becomes `\"334\"`, and `\"334\" + 5` becomes `\"3345\"`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list1 = List.of(1, 2);\n        List<Integer> list2 = Arrays.asList(3, 4);\n        list2.set(0, 5);\n        try {\n            list1.set(0, 6);\n        } catch (Exception e) {}\n        System.out.println(list1.get(0) + \" \" + list2.get(0));\n    }\n}\n```",
    options: JSON.stringify(["6 5", "1 5", "1 3", "Exception"]),
    correctAnswer: "1 5",
    explanation: "`List.of()` creates a truly immutable list; attempting to call `set()` throws an `UnsupportedOperationException`. `Arrays.asList()` creates a fixed-size list backed by an array; you cannot `add()` or `remove()`, but you CAN `set()` existing elements. Thus, `list1` stays 1, and `list2` updates to 5."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    enum Color { RED, BLUE }\n    public static void main(String[] args) {\n        Color c = Color.RED;\n        switch (c) {\n            case Color.RED:\n                System.out.print(\"RED\");\n                break;\n            case BLUE:\n                System.out.print(\"BLUE\");\n                break;\n        }\n    }\n}\n```",
    options: JSON.stringify(["RED", "BLUE", "Compile Error", "Runtime Error"]),
    correctAnswer: "Compile Error",
    explanation: "In a Java `switch` statement over an enum, the case labels MUST strictly be the unqualified enum constant names (e.g., `case RED:`). Using the fully qualified name (`case Color.RED:`) results in a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String text = \"\"\"\n            A\n             B\n            C\n            \"\"\";\n        System.out.println(text.length());\n    }\n}\n```",
    options: JSON.stringify(["12", "6", "Compile Error", "8"]),
    correctAnswer: "6 (A\\n B\\nC\\n)",
    explanation: "Java Text Blocks (`\"\"\"`) automatically strip common incidental leading whitespace from all lines. The minimum indentation on any line (which is `A` and `C`) determines the baseline. `B` is indented one space further, so that one space is kept. Line endings are normalized to `\\n`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Resource implements AutoCloseable {\n    String name;\n    Resource(String name) { this.name = name; }\n    public void close() { System.out.print(name + \" \"); }\n}\npublic class Main {\n    public static void main(String[] args) {\n        try (Resource r1 = new Resource(\"1\");\n             Resource r2 = new Resource(\"2\")) {\n            System.out.print(\"Exec \");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Exec 1 2", "1 2 Exec", "Exec 2 1", "Compile Error"]),
    correctAnswer: "Exec 2 1",
    explanation: "In a `try-with-resources` block, resources are automatically closed in the exact REVERSE order of their declaration. It executes the try block ('Exec '), then closes `r2` ('2 '), then closes `r1` ('1 ')."
  },
  // --- BATCH 9: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nPromise.resolve(1)\n  .then(x => { x + 1; })\n  .then(x => console.log(x));\n```",
    options: JSON.stringify(["2", "1", "undefined", "Error"]),
    correctAnswer: "undefined",
    explanation: "Arrow functions with curly braces `{}` do NOT return implicitly. Because there is no explicit `return` statement inside the first `.then()`, it implicitly returns `undefined`. The next `.then()` receives `undefined` and logs it."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [5];\nconst res = arr.reduce((acc, val) => {\n  console.log('Called');\n  return acc + val;\n});\nconsole.log(res);\n```",
    options: JSON.stringify(["Called\\n5", "5", "Called\\nNaN", "Error"]),
    correctAnswer: "5",
    explanation: "If `reduce()` is called on an array with exactly ONE element, and NO initial value is provided, the callback function is NEVER executed. It simply returns that single element directly. Thus, 'Called' never prints."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst [x, y, ...rest] = \"Hi\";\nconsole.log(rest);\n```",
    options: JSON.stringify(["[]", "['']", "undefined", "Error"]),
    correctAnswer: "[]",
    explanation: "Strings are iterables in JavaScript, so they can be destructured into arrays of characters. 'H' goes to `x`, 'i' goes to `y`. Because there are no characters left, the rest operator `...rest` aggressively collects the remainder into an empty array `[]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(void function() { return 10; }());\n```",
    options: JSON.stringify(["10", "undefined", "null", "Error"]),
    correctAnswer: "undefined",
    explanation: "The `void` operator evaluates the given expression and then strictly returns `undefined`, regardless of what the expression evaluated to. It is often used to force functions to be evaluated as expressions (like IIFEs) without leaking their return values."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nsetTimeout((a, b) => console.log(a + b), 0, 10, 20);\nconsole.log(5);\n```",
    options: JSON.stringify(["30\\n5", "5\\nNaN", "5\\n30", "Error"]),
    correctAnswer: "5\\n30",
    explanation: "The `setTimeout` function evaluates asynchronously, so `5` prints first. The lesser-known feature is that `setTimeout` accepts additional arguments after the delay (`0`), which are passed directly to the callback function as parameters (`10` and `20`), resulting in `30`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [1, 2, 3];\ndelete arr[1];\nconsole.log(arr.length, arr[1]);\n```",
    options: JSON.stringify(["2 undefined", "3 undefined", "2 3", "Error"]),
    correctAnswer: "3 undefined",
    explanation: "Using the `delete` operator on an array index deletes the value, leaving a sparse 'hole' (empty slot), but it does NOT shift elements or change the `.length` property of the array. The length remains 3, and accessing the deleted index yields `undefined`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\nconsole.log(g.next().value);\nconsole.log(g.return(5).value);\nconsole.log(g.next().value);\n```",
    options: JSON.stringify(["1\\n5\\n2", "1\\n5\\nundefined", "1\\nundefined\\n2", "Error"]),
    correctAnswer: "1\\n5\\nundefined",
    explanation: "The `return()` method on a generator instance aggressively forces the generator to immediately complete, returning the provided value (5). Any subsequent calls to `next()` will confirm the generator is done, returning `{value: undefined, done: true}`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst map = new Map();\nmap.set({}, 100);\nmap.set({}, 200);\nconsole.log(map.size, map.get({}));\n```",
    options: JSON.stringify(["1 200", "2 undefined", "2 200", "1 undefined"]),
    correctAnswer: "2 undefined",
    explanation: "Unlike simple objects, a `Map` preserves keys by strict reference equality. Because `{}` creates a brand new, distinct object in memory every time it is evaluated, the two `set` calls use different keys (size becomes 2). The `get({})` call creates a third, unrelated object, which fails to match anything in the map."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\narr = [1, 2, 3]\nfor i in arr:\n    arr.pop()\nprint(arr)\n```",
    options: JSON.stringify(["[]", "[1]", "[1, 2]", "RuntimeError"]),
    correctAnswer: "[1]",
    explanation: "Iterating over a list while mutating its size alters the internal iteration index. Loop 1: `i=1` (index 0), array becomes `[1, 2]`. Loop 2: iterator moves to index 1, fetching `2`, array becomes `[1]`. Loop 3: iterator moves to index 2, but length is 1, so the loop terminates!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ngen = (x for x in range(3))\nres1 = list(gen)\nres2 = list(gen)\nprint(res1, res2)\n```",
    options: JSON.stringify(["[0, 1, 2] [0, 1, 2]", "[0, 1, 2] []", "[] []", "Error"]),
    correctAnswer: "[0, 1, 2] []",
    explanation: "Generators in Python are entirely single-pass iterators. Once a generator is exhausted by `list(gen)`, it cannot be restarted or reused. The second call to `list(gen)` simply returns an empty list `[]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Base:\n    __slots__ = ['x']\nclass Derived(Base):\n    pass\n\nd = Derived()\nd.y = 10\nprint(d.y)\n```",
    options: JSON.stringify(["10", "AttributeError", "None", "Error"]),
    correctAnswer: "10",
    explanation: "This is the `__slots__` inheritance trap. If a parent class defines `__slots__` to prevent dynamic attributes and save memory, the child class MUST ALSO explicitly declare `__slots__`. Because `Derived` did not, Python silently creates a standard `__dict__` for it, allowing dynamic attribute assignment (`d.y = 10`) to succeed."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef outer():\n    x = 10\n    def inner():\n        nonlocal x\n        x += 5\n    inner()\n    print(x)\nouter()\n```",
    options: JSON.stringify(["10", "15", "UnboundLocalError", "SyntaxError"]),
    correctAnswer: "15",
    explanation: "The `nonlocal` keyword explicitly binds a variable to its nearest enclosing scope (excluding the global scope). This allows the nested function `inner` to directly modify the `x` variable declared in `outer`, changing it to 15."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    print(hash((1, 2, [3, 4])))\nexcept TypeError:\n    print(\"TypeError\")\n```",
    options: JSON.stringify(["Some integer", "TypeError", "None", "0"]),
    correctAnswer: "TypeError",
    explanation: "While tuples themselves are immutable, they are only hashable if ALL of their contents are also hashable. Because the tuple contains a mutable list `[3, 4]`, the entire tuple becomes unhashable, throwing a `TypeError: unhashable type: 'list'`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(any([]), all([]))\n```",
    options: JSON.stringify(["False False", "True True", "False True", "True False"]),
    correctAnswer: "False True",
    explanation: "`any()` returns `True` if AT LEAST ONE element is truthy. Since the list is empty, it evaluates to `False`. `all()` returns `True` if NO elements are falsy (vacuous truth). Since the list is empty and has no falsy elements, it returns `True`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(round(2.5), round(3.5))\n```",
    options: JSON.stringify(["3 4", "2 3", "2 4", "3 3"]),
    correctAnswer: "2 4",
    explanation: "Python 3 uses 'Banker's Rounding' (round half to even) by default for floats that fall exactly halfway between two integers. 2.5 is exactly between 2 and 3, so it rounds to the nearest even number: 2. 3.5 is exactly between 3 and 4, so it rounds to 4."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {}\ndef expensive_operation():\n    print(\"Evaluated\")\n    return 5\n\nd['a'] = 10\nd.setdefault('a', expensive_operation())\nprint(d['a'])\n```",
    options: JSON.stringify(["10", "Evaluated\\n10", "Evaluated\\n5", "5"]),
    correctAnswer: "Evaluated\\n10",
    explanation: "`setdefault` only assigns the value if the key does not exist. The key 'a' exists, so it keeps `10`. However, the arguments to a function call are eagerly evaluated BEFORE the function executes. Thus, `expensive_operation()` is fully executed (printing 'Evaluated') even though its return value is discarded."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v{10, 2};\n    std::cout << v.size();\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "2", "Compiler Error", "Undefined"]),
    correctAnswer: "2",
    explanation: "This is a Uniform Initialization trap. If a class has a constructor taking a `std::initializer_list`, braced initialization `{}` strongly prefers it over other constructors. `v{10, 2}` uses the initializer list, creating a vector containing exactly two elements: 10 and 2. (Conversely, `v(10, 2)` would create 10 elements of value 2)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void func() const { std::cout << \"Base\"; }\n};\nclass Derived : public Base {\npublic:\n    void func() override { std::cout << \"Derived\"; }\n};\nint main() {\n    Derived d;\n    return 0;\n}\n```",
    options: JSON.stringify(["Base", "Derived", "Compiler Error", "No output"]),
    correctAnswer: "Compiler Error",
    explanation: "The `override` keyword forces the compiler to verify that the method precisely overrides a virtual function in a base class. Because the base class `func()` is marked `const`, but the derived class `func()` is missing `const`, the signatures do not match. The compiler rejects it."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <string_view>\n#include <string>\nint main() {\n    std::string_view sv = std::string(\"Temporary\");\n    std::cout << sv;\n    return 0;\n}\n```",
    options: JSON.stringify(["Temporary", "Compiler Error", "Undefined Behavior", "Garbage"]),
    correctAnswer: "Undefined Behavior (Often Garbage)",
    explanation: "`std::string_view` is merely a non-owning view (pointer and size). Creating an unnamed `std::string` allocates a temporary object on the heap. At the end of the statement `;`, the temporary string is immediately destroyed, leaving `sv` as a dangling pointer pointing to freed memory."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    try {\n        throw std::string(\"Error\");\n    } catch (std::string* e) {\n        std::cout << \"Caught Pointer\";\n    } catch (...) {\n        std::cout << \"Caught All\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Caught Pointer", "Caught All", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Caught All",
    explanation: "The `throw` statement throws a `std::string` object BY VALUE. The first catch block expects a POINTER to a string (`std::string*`). Because types do not match, it falls through to the generic catch-all handler `catch (...)`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Empty {};\nclass Optimized : public Empty {\n    int x;\n};\nint main() {\n    std::cout << (sizeof(Optimized) == sizeof(int));\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Garbage"]),
    correctAnswer: "1",
    explanation: "This is the Empty Base Class Optimization (EBCO). Normally, every discrete object must have a non-zero size (at least 1 byte). However, if an empty class is used strictly as a base class, compilers are allowed to allocate 0 bytes for it, meaning the child class size is solely determined by its own members (`int`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nenum Color { RED, GREEN };\nenum class Status { OK, FAIL };\nint main() {\n    int x = RED;\n    int y = Status::OK;\n    std::cout << x << y;\n    return 0;\n}\n```",
    options: JSON.stringify(["00", "01", "Compiler Error", "Garbage"]),
    correctAnswer: "Compiler Error",
    explanation: "Traditional unscoped enums (`enum`) implicitly convert to integers (so `int x = RED` is valid). However, C++11 Scoped Enums (`enum class`) provide strong type safety. They NEVER implicitly convert to integers. `int y = Status::OK` causes a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint x = 10;\nauto getRef() -> auto& {\n    return x;\n}\nint main() {\n    getRef() = 20;\n    std::cout << x;\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "20", "Compiler Error", "Garbage"]),
    correctAnswer: "20",
    explanation: "The trailing return type `auto&` correctly deduces an l-value reference to the global variable `x`. When `getRef() = 20` is executed, the function call acts as an l-value, directly mutating the global variable `x` to 20."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.Optional;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            Optional<String> opt = Optional.of(null);\n            System.out.println(\"Success\");\n        } catch (NullPointerException e) {\n            System.out.println(\"NPE\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Success", "NPE", "Compile Error", "No output"]),
    correctAnswer: "NPE",
    explanation: "`Optional.of()` strictly expects a non-null value. Passing `null` to it immediately throws a `NullPointerException`. If the value might be null, you MUST use `Optional.ofNullable()` instead."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Parent {\n    public Object get() { return new Object(); }\n}\nclass Child extends Parent {\n    public String get() { return \"Child\"; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.println(p.get());\n    }\n}\n```",
    options: JSON.stringify(["Child", "java.lang.Object", "Compile Error", "ClassCastException"]),
    correctAnswer: "Child",
    explanation: "This demonstrates Covariant Return Types. Java allows an overridden method in a subclass to return a more specific type (a subtype) than the method in the parent class. Since `String` is a subclass of `Object`, it compiles perfectly and executes polymorphically."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface Config {\n    int MAX = 100;\n}\npublic class Main {\n    public static void main(String[] args) {\n        Config.MAX = 200;\n        System.out.println(Config.MAX);\n    }\n}\n```",
    options: JSON.stringify(["200", "100", "Compile Error", "Runtime Error"]),
    correctAnswer: "Compile Error",
    explanation: "Any field defined inside a Java interface is implicitly `public static final`, regardless of whether you type the keywords. Attempting to reassign `Config.MAX = 200` violates the `final` constraint, causing a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Integer a = 127;\n        Integer b = 127;\n        Integer c = 128;\n        Integer d = 128;\n        System.out.print((a == b) + \" \" + (c == d));\n    }\n}\n```",
    options: JSON.stringify(["true true", "false false", "true false", "false true"]),
    correctAnswer: "true false",
    explanation: "Java's `Integer` class caches object instances for values between -128 and 127 (inclusive). Autoboxing 127 retrieves the same instance from the cache, so `a == b` is true. Autoboxing 128 creates two completely distinct objects on the heap, so `c == d` is false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String text = \"a.b.c\";\n        System.out.print(text.replaceAll(\".\", \"-\"));\n    }\n}\n```",
    options: JSON.stringify(["a-b-c", "a.b.c", "-----", "Compile Error"]),
    correctAnswer: "-----",
    explanation: "Unlike `replace()` which matches literal characters, `replaceAll()` expects a Regular Expression as its first argument. In regex, the `.` character matches ANY character. Therefore, it replaces every single character in the string with a dash."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static int test() {\n        try {\n            throw new Exception(\"Try\");\n        } finally {\n            return 10;\n        }\n    }\n    public static void main(String[] args) {\n        System.out.print(test());\n    }\n}\n```",
    options: JSON.stringify(["10", "Exception: Try", "Compile Error", "Runtime Error"]),
    correctAnswer: "10",
    explanation: "If a `finally` block contains a `return` statement (or throws an exception), it abruptly terminates and completely swallows any unhandled exception currently propagating from the `try` or `catch` block. The function returns 10 cleanly."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>() {{\n            add(\"A\"); add(\"B\");\n        }};\n        System.out.println(list.getClass().getSimpleName());\n    }\n}\n```",
    options: JSON.stringify(["ArrayList", "List", "Compile Error", "Empty String (Anonymous Class)"]),
    correctAnswer: "Empty String (Anonymous Class)",
    explanation: "This uses Double Brace Initialization. It doesn't just initialize an ArrayList; it creates an entirely new Anonymous Inner Class that extends ArrayList, with an instance initialization block. Anonymous classes have no simple name, returning an empty string (and quietly holding a reference to their enclosing class, risking memory leaks)."
  },
  // --- BATCH 10: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(parseInt('10px') === Number('10px'));\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "false",
    explanation: "`parseInt()` parses characters one by one until it hits a non-numeric character, so `parseInt('10px')` returns `10`. However, the `Number()` constructor attempts to convert the entire string into a number. Because it contains 'px', `Number('10px')` fails and returns `NaN`. `10 === NaN` is false."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(Object.keys({ b: 1, '10': 2, a: 3, '2': 4 }));\n```",
    options: JSON.stringify(["['b', '10', 'a', '2']", "['2', '10', 'a', 'b']", "['2', '10', 'b', 'a']", "['b', 'a', '2', '10']"]),
    correctAnswer: "['2', '10', 'b', 'a']",
    explanation: "In modern JavaScript (ES6+), object keys are ordered according to strict rules: first, all integer-like string keys are sorted in ascending NUMERIC order ('2', '10'). Then, all remaining string keys are appended in their original INSERTION order ('b', 'a')."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(0 || 1, 0 ?? 1);\n```",
    options: JSON.stringify(["1 1", "0 0", "1 0", "0 1"]),
    correctAnswer: "1 0",
    explanation: "The Logical OR operator `||` falls back on ANY falsy value (`0`, `''`, `false`, `null`, `undefined`). So `0 || 1` returns `1`. The Nullish Coalescing operator `??` ONLY falls back if the left side is strictly `null` or `undefined`. Since `0` is not nullish, `0 ?? 1` returns `0`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(+[]);\nconsole.log(+![]);\n```",
    options: JSON.stringify(["0\\n1", "0\\n0", "NaN\\nNaN", "0\\nNaN"]),
    correctAnswer: "0\\n0",
    explanation: "The unary `+` coerces values to numbers. An empty array `[]` coerces to `''`, which coerces to `0`. For the second line: `[]` is truthy, so `![]` is `false`. Coercing `false` to a number with `+` yields `0`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log('toString' in {});\nconsole.log({}.hasOwnProperty('toString'));\n```",
    options: JSON.stringify(["true\\ntrue", "false\\nfalse", "true\\nfalse", "false\\ntrue"]),
    correctAnswer: "true\\nfalse",
    explanation: "The `in` operator searches for properties both on the object AND anywhere up its prototype chain (finding `Object.prototype.toString`, so it returns true). `hasOwnProperty()` STRICTLY checks the object itself, ignoring the prototype chain (so it returns false)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst str = \"a1b2\";\nconst res = str.replace(/\\d/g, x => x * 2);\nconsole.log(res);\n```",
    options: JSON.stringify(["a1b2", "a2b4", "aNaNbNaN", "Error"]),
    correctAnswer: "a2b4",
    explanation: "The `String.prototype.replace()` method can accept a callback function as its second argument. For every match of the regex `\\d` (digits), the callback is invoked with the match. '1' * 2 = 2, and '2' * 2 = 4, resulting in 'a2b4'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  yield* \"AB\";\n}\nconsole.log([...gen()]);\n```",
    options: JSON.stringify(["['AB']", "['A', 'B']", "Error", "undefined"]),
    correctAnswer: "['A', 'B']",
    explanation: "The `yield*` operator expects an iterable and delegates execution to it. Since strings are iterables of characters in JavaScript, `yield* \"AB\"` yields 'A' and then yields 'B'. The spread operator collects them into an array."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = { val: 1 };\nObject.freeze(obj);\nobj.val = 2;\nconsole.log(obj.val);\n```",
    options: JSON.stringify(["1", "2", "TypeError", "undefined"]),
    correctAnswer: "1 (TypeError in Strict Mode)",
    explanation: "`Object.freeze()` makes an object completely immutable. Attempting to modify `obj.val` fails silently in normal mode, leaving the value as 1. (Note: It would throw a TypeError if the code were explicitly in 'use strict' mode)."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nmatrix = [[0]] * 3\nmatrix[0].append(1)\nprint(matrix)\n```",
    options: JSON.stringify(["[[0, 1], [0], [0]]", "[[0, 1], [0, 1], [0, 1]]", "[[0], [0], [0]]", "Error"]),
    correctAnswer: "[[0, 1], [0, 1], [0, 1]]",
    explanation: "List multiplication `[[0]] * 3` creates a new outer list containing three REFERENCES to the EXACT SAME inner list object. When you append 1 to `matrix[0]`, you mutate that single shared inner list, so the change appears in all three positions."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nfuncs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])\n```",
    options: JSON.stringify(["[0, 1, 2]", "[2, 2, 2]", "[0, 0, 0]", "Error"]),
    correctAnswer: "[2, 2, 2]",
    explanation: "This is a classic Late Binding closure trap. The lambdas do not capture the value of `i` at the time they are created; they capture a reference to the loop variable `i`. By the time `f()` is called, the loop has finished, and `i` has its final value of 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(-5 // 2)\n```",
    options: JSON.stringify(["-2", "-2.5", "-3", "Error"]),
    correctAnswer: "-3",
    explanation: "In Python, the integer floor division operator `//` mathematically rounds towards NEGATIVE INFINITY. While `-5 / 2` is `-2.5`, rounding `-2.5` down towards negative infinity yields `-3`, not `-2`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ns1 = \" a  b \".split()\ns2 = \" a  b \".split(\" \")\nprint(len(s1), len(s2))\n```",
    options: JSON.stringify(["2 2", "4 4", "2 4", "2 5"]),
    correctAnswer: "2 5",
    explanation: "`.split()` with NO arguments treats any length of consecutive whitespace as a single delimiter and strips leading/trailing whitespace, returning `['a', 'b']` (length 2). `.split(\" \")` strictly splits on every single space character, returning `['', 'a', '', 'b', '']` (length 5)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    def __len__(self):\n        return 0\n\nif A():\n    print(\"True\")\nelse:\n    print(\"False\")\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "False",
    explanation: "When evaluating the truthiness of an object, Python first looks for the `__bool__` method. If `__bool__` is not implemented, it silently falls back to `__len__`. Since `__len__` returns 0, the object evaluates to False."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(isinstance(type, object) and isinstance(object, type))\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "In Python's core object model, `type` is an instance of `object` (because everything is an object, including classes). Conversely, `object` is an instance of `type` (because `object` itself is a class, and all classes are instances of the metaclass `type`). Both are true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint(D.mro()[2].__name__)\n```",
    options: JSON.stringify(["A", "B", "C", "object"]),
    correctAnswer: "C",
    explanation: "Python uses the C3 Linearization algorithm to determine the Method Resolution Order (MRO). For `D(B, C)`, it visits `D`, then its first parent `B`. Before visiting `A` (which is shared), it must resolve the other branch, visiting `C`. So the MRO is D -> B -> C -> A -> object. Index 2 is `C`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nval = ...\nprint(type(val).__name__)\n```",
    options: JSON.stringify(["NoneType", "Ellipsis", "ellipsis", "SyntaxError"]),
    correctAnswer: "ellipsis",
    explanation: "The literal `...` is valid Python syntax and evaluates to a built-in singleton object named `Ellipsis`. However, the name of its actual type class (as returned by `type(val).__name__`) is lowercase `'ellipsis'`."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Counter {\n    int count = 0;\npublic:\n    Counter& operator++() { count += 1; return *this; }\n    Counter operator++(int) { Counter temp = *this; count += 2; return temp; }\n    int get() { return count; }\n};\nint main() {\n    Counter c;\n    c++;\n    std::cout << c.get();\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "2", "3", "Compiler Error"]),
    correctAnswer: "2",
    explanation: "To distinguish between pre-increment and post-increment overloading, C++ uses a dummy `int` parameter for the POST-increment operator. `c++` calls `operator++(int)`, which internally adds 2 to the count. So `c.get()` returns 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void show() = 0;\n};\nvoid Base::show() { std::cout << \"Base\"; }\n\nclass Derived : public Base {\npublic:\n    void show() override { Base::show(); }\n};\nint main() {\n    Derived d;\n    d.show();\n    return 0;\n}\n```",
    options: JSON.stringify(["Base", "Compiler Error", "Linker Error", "Undefined Behavior"]),
    correctAnswer: "Base",
    explanation: "In C++, a Pure Virtual Function (`= 0`) forces derived classes to override it, making the class abstract. However, the base class is STILL allowed to provide an implementation for it! The derived class successfully overrides it and explicitly calls the base implementation `Base::show()`, printing 'Base'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Data {\n    mutable int accesses = 0;\npublic:\n    void read() const { accesses++; }\n    int get() const { return accesses; }\n};\nint main() {\n    const Data d;\n    d.read();\n    std::cout << d.get();\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1",
    explanation: "Normally, a `const` member function cannot modify any member variables (and a `const` object can only call `const` functions). However, marking a variable as `mutable` explicitly exempts it from `const` checks, allowing `accesses` to be safely modified even inside a `const` function."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    void func(int x) { std::cout << \"Int\"; }\n};\nclass Derived : public Base {\npublic:\n    void func(double x) { std::cout << \"Double\"; }\n};\nint main() {\n    Derived d;\n    d.func(5);\n    return 0;\n}\n```",
    options: JSON.stringify(["Int", "Double", "Compiler Error", "Garbage"]),
    correctAnswer: "Double",
    explanation: "This is Name Hiding (Shadowing). Because `Derived` declares a function named `func`, it completely hides ALL functions named `func` in the `Base` class, even if the parameter types differ. The compiler ignores `Base::func(int)` and coerces the `int` 5 into a `double` to call `Derived::func(double)`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code compiled in C++20?\n```cpp\n#include <iostream>\nstruct Point {\n    int x;\n    int y;\n};\nint main() {\n    Point p{.y = 2, .x = 1};\n    std::cout << p.x << p.y;\n    return 0;\n}\n```",
    options: JSON.stringify(["12", "00", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Compiler Error",
    explanation: "C++20 introduced Designated Initializers (borrowed from C). However, unlike C, C++ strictly mandates that the designated initializers MUST appear in the exact same order as the members are declared in the struct. Initializing `.y` before `.x` is a hard compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base { public: virtual void p() { std::cout<<\"B\"; } };\nclass Derived : public Base { public: void p() override { std::cout<<\"D\"; } };\n\nint main() {\n    try {\n        throw Derived();\n    } catch (Base e) {\n        e.p();\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["B", "D", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "B",
    explanation: "This demonstrates Exception Slicing. The exception is caught BY VALUE (`catch (Base e)`) rather than by reference (`catch (Base& e)`). The `Derived` object is copy-constructed into a pure `Base` object, slicing off its derived properties. Calling `e.p()` invokes `Base::p()`, printing 'B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass MyClass {\npublic:\n    void hello() { std::cout << \"Hi\"; }\n};\nint main() {\n    void (MyClass::*ptr)() = &MyClass::hello;\n    MyClass obj;\n    (obj.*ptr)();\n    return 0;\n}\n```",
    options: JSON.stringify(["Hi", "Compiler Error", "Linker Error", "Undefined Behavior"]),
    correctAnswer: "Hi",
    explanation: "This is the syntax for a Pointer to a Member Function. `ptr` stores the memory offset of `hello()` relative to `MyClass`. To invoke it, you must use an instance of the class (`obj`) and the pointer-to-member operator `.*`."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface A { default void run() { System.out.print(\"A\"); } }\ninterface B { default void run() { System.out.print(\"B\"); } }\npublic class Main implements A, B {\n    public static void main(String[] args) {\n        new Main().run();\n    }\n}\n```",
    options: JSON.stringify(["A", "B", "Compile Error", "Runtime Error"]),
    correctAnswer: "Compile Error",
    explanation: "This is Java's approach to the Multiple Inheritance Diamond Problem. If a class implements two interfaces that provide a default method with the exact same signature, the compiler refuses to guess which one to use. You MUST explicitly override the `run()` method in `Main` to resolve the conflict, otherwise it fails to compile."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Outer {\n    class Inner { void print() { System.out.print(\"In\"); } }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Outer.Inner obj = new Outer().new Inner();\n        obj.print();\n    }\n}\n```",
    options: JSON.stringify(["In", "Compile Error", "Runtime Error", "No output"]),
    correctAnswer: "In",
    explanation: "This is the correct, albeit unusual, syntax to instantiate a non-static Inner class from outside its enclosing class. Because a non-static inner class strictly requires an instance of its Outer class to exist, you must first create `new Outer()` and chain `.new Inner()` onto that instance."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(5 / 2 + 5 / 2.0);\n    }\n}\n```",
    options: JSON.stringify(["5.0", "4.5", "4.0", "5"]),
    correctAnswer: "4.5",
    explanation: "`5 / 2` is integer division, which truncates the decimal and evaluates to `2`. `5 / 2.0` promotes the integer 5 to a double, performing floating-point division to get `2.5`. The sum `2 + 2.5` results in the double `4.5`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.io.*;\nclass Data implements Serializable {\n    transient int id = 5;\n}\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        System.out.println(\"Compiled\");\n    }\n}\n```",
    options: JSON.stringify(["Compiled", "Compile Error", "Runtime Error", "No output"]),
    correctAnswer: "Compiled",
    explanation: "The code compiles perfectly. The `transient` keyword marks the `id` field to be completely ignored during Java Serialization. If this object were serialized and deserialized, `id` would revert to the default integer value of `0` instead of `5`."
  },
  // --- BATCH 11: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst add = (a, b) => a + b;\nconst addFive = add.bind(null, 5);\nconsole.log(addFive());\n```",
    options: JSON.stringify(["5", "NaN", "Error", "undefined"]),
    correctAnswer: "NaN",
    explanation: "`bind(null, 5)` partially applies the first argument `a` to 5. However, when `addFive()` is called with no arguments, the second argument `b` becomes `undefined`. In JavaScript, `5 + undefined` evaluates to `NaN`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [10, 1, 21, 2];\narr.sort();\nconsole.log(arr);\n```",
    options: JSON.stringify(["[1, 2, 10, 21]", "[10, 1, 21, 2]", "[1, 10, 2, 21]", "Error"]),
    correctAnswer: "[1, 10, 2, 21]",
    explanation: "By default, `Array.prototype.sort()` converts all elements into strings and sorts them alphabetically (lexicographically) by UTF-16 code units. Alphabetically, '10' comes before '2'. To sort numerically, you MUST provide a comparator function like `(a, b) => a - b`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst s = new Set();\ns.add([1]);\ns.add([1]);\nconsole.log(s.size);\n```",
    options: JSON.stringify(["1", "2", "0", "Error"]),
    correctAnswer: "2",
    explanation: "A `Set` ensures uniqueness using the SameValueZero algorithm, which checks object identity strictly by reference, not by value. Because `[1]` and `[1]` create two distinct array objects in memory, the `Set` treats them as two completely different keys."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst { a = 1, b = 2 } = { a: undefined, b: null };\nconsole.log(a, b);\n```",
    options: JSON.stringify(["1 2", "undefined null", "1 null", "undefined 2"]),
    correctAnswer: "1 null",
    explanation: "In Object Destructuring, default values are ONLY triggered when the destructured value is strictly `undefined`. `a` is `undefined`, so it triggers the default `1`. `b` is `null` (which is a defined value, distinct from `undefined`), so it retains `null` and ignores the default `2`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = Object.create(null);\nconsole.log(obj.toString);\n```",
    options: JSON.stringify(["[object Object]", "undefined", "Error", "null"]),
    correctAnswer: "undefined",
    explanation: "`Object.create(null)` creates a completely \"pure\" dictionary object that intentionally lacks a prototype chain. Because it does not inherit from `Object.prototype`, it does not have built-in methods like `.toString()`, `.hasOwnProperty()`, etc. Thus, accessing `.toString` yields `undefined` (or throws if invoked)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(3 in [10, 20, 30]);\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "false",
    explanation: "When used on an array, the `in` operator checks if a specific INDEX exists in the array (not if a value exists). The array `[10, 20, 30]` has indices 0, 1, and 2. Index 3 does not exist, so it returns `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(''.padStart(3, 'ab'));\n```",
    options: JSON.stringify(["aba", "ab", "abab", "Error"]),
    correctAnswer: "aba",
    explanation: "`String.prototype.padStart(targetLength, padString)` pads the string from the start. We asked for a target length of 3 using the string 'ab'. It adds 'ab', bringing the length to 2, and then adds 'a' (the first character of the pad string) to hit exactly length 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  try {\n    yield 1;\n  } catch (e) {\n    yield 2;\n  }\n}\nconst g = gen();\nconsole.log(g.next().value);\nconsole.log(g.throw(new Error()).value);\n```",
    options: JSON.stringify(["1\\n2", "1\\nError", "1\\nundefined", "Error"]),
    correctAnswer: "1\\n2",
    explanation: "The `generator.throw()` method injects an exception precisely at the point where the generator is currently paused (`yield 1`). The internal `try...catch` block catches this injected exception and cleanly executes `yield 2`, returning `2` as the next value."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    class MyBool(bool):\n        pass\n    print(\"Success\")\nexcept TypeError:\n    print(\"TypeError\")\n```",
    options: JSON.stringify(["Success", "TypeError", "SyntaxError", "None"]),
    correctAnswer: "TypeError",
    explanation: "In Python, the built-in `bool` type is strictly finalized. The interpreter forbids any class from inheriting from `bool` because booleans are designed to be immutable singletons (`True` and `False`). Attempting to subclass it raises a `TypeError`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    res = \"-\".join([\"1\", 2, \"3\"])\n    print(res)\nexcept TypeError:\n    print(\"TypeError\")\n```",
    options: JSON.stringify(["1-2-3", "TypeError", "123", "None"]),
    correctAnswer: "TypeError",
    explanation: "The `str.join()` method strictly requires the provided iterable to contain ONLY string objects. It does not automatically coerce integers or other types into strings. Because the list contains the integer `2`, it throws a `TypeError: sequence item 1: expected str instance, int found`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nimport math\nprint(math.trunc(-2.5), math.floor(-2.5))\n```",
    options: JSON.stringify(["-2 -3", "-3 -3", "-2 -2", "-3 -2"]),
    correctAnswer: "-2 -3",
    explanation: "`math.trunc()` simply chops off the fractional part, truncating towards zero, resulting in `-2`. `math.floor()` is mathematical flooring, which always rounds down towards negative infinity. The next lowest integer below `-2.5` is `-3`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = dict.fromkeys([1, 2], [])\nd[1].append(\"A\")\nprint(d[2])\n```",
    options: JSON.stringify(["['A']", "[]", "Error", "None"]),
    correctAnswer: "['A']",
    explanation: "The `dict.fromkeys(iterable, value)` method creates a dictionary where all keys point to the EXACT SAME object reference provided as the default value. Because `[]` is a single mutable list instance, modifying `d[1]` mutates the shared list, meaning `d[2]` also evaluates to `['A']`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ndef my_decorator(func):\n    print(\"Dec\", end=\" \")\n    return func\n\n@my_decorator\ndef test():\n    pass\n\nprint(\"Done\")\n```",
    options: JSON.stringify(["Done", "Dec Done", "Done Dec", "Error"]),
    correctAnswer: "Dec Done",
    explanation: "Decorators are evaluated and executed immediately when the function they decorate is DEFINED, not when the function is called. The interpreter sees `@my_decorator`, calls it, prints 'Dec ', and then continues execution, printing 'Done'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ns1 = {1, 2}\ns2 = {2, 3}\nprint(s1 ^ s2)\n```",
    options: JSON.stringify(["{1, 3}", "{2}", "{1, 2, 3}", "Error"]),
    correctAnswer: "{1, 3}",
    explanation: "The `^` operator on sets performs a Symmetric Difference. It returns a new set containing all elements that are in exactly one of the sets, but not in both. The element `2` is in both, so it is removed, leaving `{1, 3}`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nfor i in range(2):\n    pass\nelse:\n    print(\"Else\")\n```",
    options: JSON.stringify(["Else", "No output", "Error", "pass"]),
    correctAnswer: "Else",
    explanation: "In Python, a `for...else` block executes the `else` clause when the loop completely exhausts its iterable without hitting a `break` statement. Since the loop simply runs `pass` and never breaks, the `else` block safely executes and prints 'Else'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 1\nprint(eval(\"x + 1\", {\"x\": 10}))\n```",
    options: JSON.stringify(["11", "2", "Error", "None"]),
    correctAnswer: "11",
    explanation: "The `eval()` function takes a string to evaluate and an optional dictionary representing the global namespace. By passing `{\"x\": 10}`, the string `\"x + 1\"` uses the `x` from the provided dictionary rather than the `x` from the outer scope, returning 11."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v;\n    for (int i = 0; i < 100; i++) v.push_back(i);\n    std::cout << (sizeof(v) > 100);\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined"]),
    correctAnswer: "0",
    explanation: "The `sizeof` operator always returns the compile-time footprint of an object's stack structure, completely ignoring dynamically allocated heap memory. A `std::vector` typically holds three pointers (start, end, capacity end) taking 24 bytes, regardless of how many elements it manages on the heap. 24 > 100 is 0 (false)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A { \npublic: \n    explicit A(int x) { std::cout << \"Int\"; }\n};\nint main() {\n    A obj = 5;\n    return 0;\n}\n```",
    options: JSON.stringify(["Int", "Compiler Error", "Garbage", "Undefined"]),
    correctAnswer: "Compiler Error",
    explanation: "The `explicit` keyword on a constructor strictly forbids the compiler from using it for implicit type conversions. The syntax `A obj = 5;` attempts to implicitly convert the integer 5 into an object of type `A`. Because the constructor is explicit, this fails to compile (it requires `A obj(5);`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    ~Base() { std::cout << \"B\"; }\n};\nclass Derived : public Base {\npublic:\n    ~Derived() { std::cout << \"D\"; }\n};\nint main() {\n    Base* ptr = new Derived();\n    delete ptr;\n    return 0;\n}\n```",
    options: JSON.stringify(["DB", "B", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Undefined Behavior (Typically just prints 'B')",
    explanation: "Because `Base` lacks a `virtual` destructor, deleting a `Derived` object via a `Base*` pointer invokes Undefined Behavior. In practice, most compilers statically resolve the destructor based on the pointer type, calling ONLY `~Base()` and leaking any resources owned by `Derived`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <array>\nint main() {\n    std::array<int, 3> arr = {1, 2, 3};\n    try {\n        arr.at(5) = 10;\n    } catch (...) {\n        std::cout << \"Caught\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Caught", "Compiler Error", "Undefined Behavior", "Garbage"]),
    correctAnswer: "Caught",
    explanation: "Unlike the bracket operator `arr[5]` which performs no bounds checking and causes Undefined Behavior, the `.at(5)` method explicitly checks the bounds. Since index 5 is out of bounds for an array of size 3, it throws a `std::out_of_range` exception, which is caught by the `catch (...)` block."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\ntemplate<typename T = int>\nclass Box {\npublic:\n    void print() { std::cout << \"Box\"; }\n};\nint main() {\n    Box b;\n    b.print();\n    return 0;\n}\n```",
    options: JSON.stringify(["Box", "Compiler Error", "Undefined", "Garbage"]),
    correctAnswer: "Compiler Error (pre-C++17)",
    explanation: "Prior to C++17 Class Template Argument Deduction (CTAD), if a class template had default arguments, you STILL had to supply empty angle brackets to instantiate it: `Box<> b;`. Writing just `Box b;` causes a compilation error. (Note: in C++17 and later, `Box b;` compiles successfully thanks to CTAD)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <typeinfo>\nclass Polymorphic { virtual void f() {} };\nint main() {\n    Polymorphic* ptr = nullptr;\n    try {\n        std::cout << typeid(*ptr).name();\n    } catch (std::bad_typeid&) {\n        std::cout << \"BadType\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["BadType", "Polymorphic", "Undefined Behavior", "Compiler Error"]),
    correctAnswer: "BadType",
    explanation: "Applying the `typeid` operator to a dereferenced null pointer is usually Undefined Behavior. HOWEVER, if the pointer points to a polymorphic class (one with virtual functions), the C++ standard requires `typeid` to dynamically check the pointer and safely throw a `std::bad_typeid` exception instead."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = 5;\n    int b = ++a + ++a;\n    std::cout << b;\n    return 0;\n}\n```",
    options: JSON.stringify(["13", "14", "12", "Undefined Behavior"]),
    correctAnswer: "Undefined Behavior",
    explanation: "Modifying the same scalar variable (`a`) multiple times within a single unsequenced expression (like `++a + ++a`) is strictly Undefined Behavior in C++. The compiler is free to evaluate the increments and additions in any order, meaning the result could be 13, 14, or anything else."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.out.print(\"Try \");\n            System.exit(0);\n        } finally {\n            System.out.print(\"Finally\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Try Finally", "Try ", "Compile Error", "Finally"]),
    correctAnswer: "Try ",
    explanation: "This is one of the rare exceptions to the rule that `finally` always executes. `System.exit(0)` aggressively terminates the entire JVM process immediately. Because the JVM shuts down, the `finally` block is completely skipped."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Object[] arr = new String[2];\n        List<Object> list = new ArrayList<String>();\n        System.out.println(\"Done\");\n    }\n}\n```",
    options: JSON.stringify(["Done", "Compile Error", "Runtime Error", "ClassCastException"]),
    correctAnswer: "Compile Error",
    explanation: "Java arrays are Covariant (a `String[]` can be assigned to an `Object[]`). However, Java Generics are strictly Invariant to ensure type safety. You cannot assign an `ArrayList<String>` to a `List<Object>`. Doing so causes a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        char c = 'A';\n        c++;\n        System.out.println(c);\n    }\n}\n```",
    options: JSON.stringify(["A", "B", "Compile Error", "66"]),
    correctAnswer: "B",
    explanation: "In Java, the unary increment operator `++` can be applied directly to a `char`. It increments the underlying UTF-16 code point (65 for 'A' becomes 66 for 'B') and automatically casts the result back to a `char`. It prints 'B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Math.abs(Integer.MIN_VALUE) == Integer.MIN_VALUE);\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "A 32-bit signed integer in Java ranges from -2,147,483,648 to 2,147,483,647. Because the absolute value of `MIN_VALUE` is 2,147,483,648 (which exceeds `MAX_VALUE` by 1), it overflows the integer boundary and wraps right back around to `Integer.MIN_VALUE`. Thus, the statement evaluates to true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        int x = 2;\n        switch (x) {\n            default: System.out.print(\"D\");\n            case 1: System.out.print(\"1\");\n            case 2: System.out.print(\"2\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["2", "D12", "D", "Compile Error"]),
    correctAnswer: "2",
    explanation: "The `default` label does not have to be at the end of a `switch` block. The switch expression evaluates to `2`, so execution jumps directly to `case 2` (skipping the default and case 1 entirely). It prints '2'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s1 = \"a\" + \"b\";\n        String s2 = \"ab\";\n        System.out.println(s1 == s2);\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "Compile-time constant string expressions (like `\"a\" + \"b\"`) are aggressively evaluated and resolved by the Java compiler during compilation. The result `\"ab\"` is placed in the String Constant Pool. `s2` points to that exact same pool instance, making `s1 == s2` true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        class Local {\n            void print() { System.out.print(x); }\n        }\n        new Local().print();\n    }\n}\n```",
    options: JSON.stringify(["10", "Compile Error", "Runtime Error", "0"]),
    correctAnswer: "10",
    explanation: "Java allows you to declare Local Classes directly inside a method. These classes can capture and access local variables from the enclosing method, provided those variables are `final` or effectively final (never modified after initialization). Since `x` is never changed, it works perfectly and prints 10."
  },
  // --- BATCH 12: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(Number([1]), Number([1, 2]));\n```",
    options: JSON.stringify(["1 NaN", "1 1", "NaN NaN", "Error"]),
    correctAnswer: "1 NaN",
    explanation: "When you cast an array to a `Number`, JavaScript first converts the array to a string using `.toString()`. `[1].toString()` becomes `'1'`, which parses to the number `1`. However, `[1, 2].toString()` becomes `'1,2'`, which fails to parse as a valid number, returning `NaN`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(typeof null, typeof undefined);\n```",
    options: JSON.stringify(["object undefined", "null undefined", "object object", "undefined undefined"]),
    correctAnswer: "object undefined",
    explanation: "This is one of the most famous historical bugs in JavaScript. Because of how variables were structured in the first version of JS (using type tags, where 0 represented an object), `null` was given the 0 type tag. As a result, `typeof null` incorrectly evaluates to `'object'`, while `typeof undefined` correctly evaluates to `'undefined'`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([1, 2, 3].map(parseInt));\n```",
    options: JSON.stringify(["[1, 2, 3]", "[1, NaN, NaN]", "[1, 0, 0]", "Error"]),
    correctAnswer: "[1, NaN, NaN]",
    explanation: "The `.map()` function passes THREE arguments to its callback: `(currentValue, index, array)`. `parseInt` accepts TWO arguments: `(string, radix)`. So, it evaluates: `parseInt(1, 0)` -> 1, `parseInt(2, 1)` -> NaN (radix 1 is invalid), and `parseInt(3, 2)` -> NaN (3 is not a valid binary digit)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nnew Promise((resolve) => {\n  console.log('A');\n  resolve();\n});\nconsole.log('B');\n```",
    options: JSON.stringify(["A\\nB", "B\\nA", "B", "Error"]),
    correctAnswer: "A\\nB",
    explanation: "While `.then()` and `.catch()` callbacks are placed in the microtask queue and run asynchronously, the executor function passed directly into the `new Promise()` constructor is executed strictly SYNCHRONOUSLY. Thus, 'A' prints immediately, followed by 'B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst { x: y } = { x: 5 };\nconsole.log(y);\n```",
    options: JSON.stringify(["5", "undefined", "Error", "null"]),
    correctAnswer: "5",
    explanation: "In Object Destructuring, the syntax `key: newName` allows you to extract a property but assign it to a local variable with a different name. It extracts the value of `x` (which is 5) and assigns it to the local variable `y`. Thus, `y` is 5."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(Math.max() > Math.min());\n```",
    options: JSON.stringify(["false", "true", "Error", "undefined"]),
    correctAnswer: "false",
    explanation: "Paradoxically, `Math.max()` with no arguments evaluates to `-Infinity` (the lowest possible baseline to start finding a maximum). Conversely, `Math.min()` with no arguments evaluates to `Infinity`. Therefore, `-Infinity > Infinity` strictly evaluates to `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nlet x = 10;\nfalse && (x = 20);\nconsole.log(x);\n```",
    options: JSON.stringify(["10", "20", "false", "Error"]),
    correctAnswer: "10",
    explanation: "The Logical AND operator (`&&`) heavily relies on short-circuit evaluation. Because the left operand evaluates to `false`, the right operand (`(x = 20)`) is NEVER evaluated or executed. The assignment never happens, and `x` remains 10."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(String.raw`a\\nb`.length);\n```",
    options: JSON.stringify(["4", "3", "Error", "undefined"]),
    correctAnswer: "4",
    explanation: "`String.raw` is a built-in tag function for template literals. It ignores escape sequences, treating backslashes as literal characters. Thus, `a\\nb` is parsed as 4 literal characters: 'a', '\\\\', 'n', 'b'. Its length is 4."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 1\nclass A:\n    x = 2\n    y = [x for _ in range(2)]\n\nprint(A.y)\n```",
    options: JSON.stringify(["[1, 1]", "[2, 2]", "Error", "None"]),
    correctAnswer: "[1, 1]",
    explanation: "In Python 3, list comprehensions execute in their own isolated nested scope. However, a class definition block does NOT create a formal enclosing scope for nested scopes to look up variables in. When the comprehension looks for `x`, it skips the class namespace entirely and finds `x = 1` in the global scope!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\na, *b, c = (1, 2, 3, 4)\nprint(type(b).__name__)\n```",
    options: JSON.stringify(["list", "tuple", "Error", "set"]),
    correctAnswer: "list",
    explanation: "In Python tuple/list unpacking, using the `*` operator on a variable creates a \"catch-all\" container for the remaining elements. Crucially, the catch-all variable (`b`) is ALWAYS constructed as a `list` object `[2, 3]`, even if the source object being unpacked was a tuple."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nt = ([1, 2],)\ntry:\n    t[0] += [3]\nexcept TypeError:\n    pass\nprint(t)\n```",
    options: JSON.stringify(["([1, 2, 3],)", "([1, 2],)", "TypeError", "Error"]),
    correctAnswer: "([1, 2, 3],)",
    explanation: "This is a notorious Python edge case. The `+=` operator executes `t[0].extend([3])` (which successfully mutates the list to `[1, 2, 3]`), but then it attempts to reassign the list back to `t[0]`. Because `t` is a tuple, the reassignment throws a `TypeError`. We catch it, but the list was ALREADY mutated!"
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(float('inf') == float('inf') + 1000)\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "According to IEEE 754 floating-point standards (which Python follows), Infinity plus any finite positive number remains Infinity. Therefore, `inf + 1000` evaluates to `inf`, and the equality check returns `True`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code (Python 3.8+)?\n```python\nx = 5\nprint(f\"{x=}\")\n```",
    options: JSON.stringify(["x=5", "5", "Error", "None"]),
    correctAnswer: "x=5",
    explanation: "Introduced in Python 3.8, placing an `=` sign at the end of an expression inside an f-string evaluates the expression AND prints the literal text of the expression alongside its result. This is incredibly useful for debugging."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(isinstance(True, int))\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "In Python, the `bool` class is actually a direct subclass of the `int` class. `True` behaves exactly like the integer `1`, and `False` behaves exactly like the integer `0`. Because `bool` inherits from `int`, `isinstance(True, int)` evaluates to `True`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(~5)\n```",
    options: JSON.stringify(["-6", "-5", "4", "5"]),
    correctAnswer: "-6",
    explanation: "The bitwise NOT operator `~` inverts all the bits of the integer. In Two's Complement representation (which Python conceptually uses for infinite precision integers), the mathematical formula for bitwise NOT is `~x = -x - 1`. Thus, `~5` is `-5 - 1`, which is `-6`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nval = 1\nprint(type(type(val)).__name__)\n```",
    options: JSON.stringify(["type", "int", "object", "Error"]),
    correctAnswer: "type",
    explanation: "`type(1)` returns the class `int`. When we call `type()` on that class, we are asking what the class of a class is. In Python, all classes are instances of the metaclass `type`. Thus, `type(int)` is `type`, and its name is 'type'."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    std::cout << sizeof('a');\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "4", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1",
    explanation: "This is a major difference between C and C++. In the C language, character literals like `'a'` are technically of type `int` (typically 4 bytes). However, in C++, character literals are strictly of type `char`, so `sizeof('a')` is guaranteed to be 1 byte."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    try {\n        throw std::runtime_error(\"A\");\n    } catch (const std::exception& e) {\n        std::cout << \"Base \";\n    } catch (const std::runtime_error& e) {\n        std::cout << \"Derived \";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Base ", "Derived ", "Base Derived ", "Compiler Error"]),
    correctAnswer: "Base ",
    explanation: "Catch blocks are evaluated strictly in the order they appear. Because `std::runtime_error` inherits from `std::exception`, the first catch block (`std::exception&`) successfully intercepts the exception. The second block is technically unreachable (compilers usually throw a warning, but it runs)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void func() final { std::cout << \"B\"; }\n};\nclass Derived : public Base {\npublic:\n    void func() { std::cout << \"D\"; }\n};\nint main() {\n    Derived d;\n    return 0;\n}\n```",
    options: JSON.stringify(["B", "D", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Compiler Error",
    explanation: "The `final` specifier in C++11 dictates that a virtual function CANNOT be overridden by any derived class. Because `Derived` attempts to declare its own `func()` method with the same signature, the compiler immediately rejects it with a compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = 1, b = 2, c = 3;\n    (true ? a : b) = 10;\n    std::cout << a << b << c;\n    return 0;\n}\n```",
    options: JSON.stringify(["1023", "123", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1023",
    explanation: "Unlike C (where the ternary operator yields an r-value), in C++, the ternary operator `? :` can yield an l-value (a modifiable memory reference) if both branches return l-values of the same type. The condition is `true`, so it returns a reference to `a`. We assign `10` to `a`, mutating it. `b` and `c` remain 2 and 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    try {\n        try {\n            throw 20;\n        } catch (int e) {\n            throw;\n        }\n    } catch (int e) {\n        std::cout << e;\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["20", "Compiler Error", "Undefined Behavior", "Garbage"]),
    correctAnswer: "20",
    explanation: "Using `throw;` with NO operand inside a `catch` block explicitly re-throws the EXACT same exception object that was just caught. The outer `try...catch` block intercepts it and safely prints the original value, 20."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Box {\npublic:\n    Box() { std::cout << \"Def \"; }\n    Box(const Box&) { std::cout << \"Copy \"; }\n};\nint main() {\n    Box b1 = Box();\n    return 0;\n}\n```",
    options: JSON.stringify(["Def ", "Def Copy ", "Copy ", "Compiler Error"]),
    correctAnswer: "Def ",
    explanation: "This demonstrates Copy Elision (specifically Return Value Optimization / RVO). Although `Box b1 = Box();` looks like it creates a temporary object and then copies it, modern C++ (mandatory in C++17) completely optimizes away the copy step, constructing the object directly into `b1`. Only the default constructor is called."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int x = 5;\n    auto func = [x]() mutable {\n        x++;\n        std::cout << x;\n    };\n    func();\n    return 0;\n}\n```",
    options: JSON.stringify(["6", "5", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "6",
    explanation: "By default, variables captured by value `[x]` in a lambda are completely read-only (`const`). However, appending the `mutable` keyword to the lambda declaration overrides this, allowing the lambda to freely modify its internal, private copy of `x`. It prints 6."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Object[] arr = new String[2];\n        try {\n            arr[0] = 5;\n            System.out.println(\"Success\");\n        } catch (ArrayStoreException e) {\n            System.out.println(\"Exception\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Exception", "Success", "Compile Error", "Runtime Error"]),
    correctAnswer: "Exception",
    explanation: "Java arrays are Covariant, so assigning `String[]` to `Object[]` compiles successfully. However, at runtime, the JVM strongly enforces that the actual backing array is of type `String`. Attempting to insert an `Integer` (`5`) into a `String` array throws a runtime `ArrayStoreException`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void print(int x) { System.out.print(\"Single\"); }\n    public static void print(int... x) { System.out.print(\"Varargs\"); }\n    public static void main(String[] args) {\n        print(5);\n    }\n}\n```",
    options: JSON.stringify(["Single", "Varargs", "Compile Error", "Runtime Error"]),
    correctAnswer: "Single",
    explanation: "In Java Method Overloading resolution, Varargs (`int... x`) have the absolute lowest priority. The compiler aggressively prefers an exact match or primitive widening before it will ever consider falling back to a Varargs signature. Thus, `print(int x)` is selected."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    Base() { System.out.print(\"B\"); }\n}\npublic class Main extends Base {\n    { System.out.print(\"I\"); }\n    Main() { System.out.print(\"M\"); }\n    public static void main(String[] args) {\n        new Main();\n    }\n}\n```",
    options: JSON.stringify(["BIM", "IBM", "MBI", "Compile Error"]),
    correctAnswer: "BIM",
    explanation: "When an object is instantiated, the precise execution order is: 1) Base class constructors (`B`), 2) Instance Initialization Blocks (`I`), 3) The Derived class constructor body (`M`). Therefore, the output is 'BIM'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface Helper {\n    static void run() { System.out.print(\"A\"); }\n}\npublic class Main implements Helper {\n    public static void main(String[] args) {\n        Helper.run();\n    }\n}\n```",
    options: JSON.stringify(["A", "Compile Error", "Runtime Error", "No output"]),
    correctAnswer: "A",
    explanation: "Java 8 introduced `static` methods in interfaces. Crucially, these methods are NOT inherited by implementing classes. You cannot call `Main.run()`, but calling the method strictly via the interface name `Helper.run()` compiles and executes perfectly."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        outer:\n        for (int i = 0; i < 2; i++) {\n            for (int j = 0; j < 2; j++) {\n                if (i == 0) continue outer;\n                System.out.print(j);\n            }\n        }\n    }\n}\n```",
    options: JSON.stringify(["01", "0", "1", "Compile Error"]),
    correctAnswer: "01",
    explanation: "Labeled `continue` statements jump immediately to the next iteration of the LABELED loop. When `i=0`, it skips the inner loop entirely and jumps to `i=1`. During `i=1`, the condition `i==0` is false, so it successfully prints `j` (which goes from 0 to 1). Output is '01'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        try {\n            throw new RuntimeException(\"A\");\n        } finally {\n            throw new RuntimeException(\"B\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Exception: B", "Exception: A", "Compile Error", "Exception: A, suppressed: B"]),
    correctAnswer: "Exception: B",
    explanation: "If an exception is thrown in a `finally` block, it violently aborts the block and COMPLETELY OVERWRITES any exception that was previously propagating from the `try` or `catch` block. The original exception 'A' is lost forever, and only 'B' is thrown up the stack."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Boolean a = true;\n        Boolean b = true;\n        System.out.print(a == b);\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "Just like small `Integer` caching, the `Boolean` wrapper class caches precisely two instances: `Boolean.TRUE` and `Boolean.FALSE`. Autoboxing the primitive `true` assigns both `a` and `b` to the exact same cached `Boolean.TRUE` object in memory, making `a == b` evaluate to true."
  },
  // --- BATCH 13: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = { \n  valueOf: () => 10, \n  toString: () => '20' \n};\nconsole.log(obj + 5);\n```",
    options: JSON.stringify(["15", "205", "105", "Error"]),
    correctAnswer: "15",
    explanation: "When an object is subjected to primitive coercion (like being used with the `+` arithmetic operator), JavaScript first looks for the `valueOf()` method. Since `valueOf` returns the number 10, the expression becomes `10 + 5`, resulting in 15. It completely ignores `toString()`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(Symbol('A') === Symbol('A'));\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "false",
    explanation: "Every `Symbol` created by the `Symbol()` factory function is guaranteed to be universally unique, even if they share the exact same descriptive string. Therefore, comparing two newly generated symbols always evaluates to `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [1, , 3];\nconst mapped = arr.map(x => x * 2);\nconsole.log(mapped);\n```",
    options: JSON.stringify(["[2, NaN, 6]", "[2, 0, 6]", "[2, undefined, 6]", "[2, empty, 6]"]),
    correctAnswer: "[2, empty, 6]",
    explanation: "JavaScript arrays can have \"holes\" (empty slots where no value, not even `undefined`, exists). Array methods like `.map()`, `.forEach()`, and `.filter()` explicitly SKIP empty slots. The resulting array retains the empty hole at index 1."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst obj = {};\nObject.defineProperty(obj, 'a', { value: 1 });\nconsole.log(Object.keys(obj));\n```",
    options: JSON.stringify(["['a']", "[]", "Error", "undefined"]),
    correctAnswer: "[]",
    explanation: "When you add a property using `Object.defineProperty()`, all descriptor flags (`enumerable`, `writable`, `configurable`) default to `false`. Because `enumerable` is false, the property 'a' is hidden from `Object.keys()`, `for...in` loops, and object spread syntax."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction test() {\n  return Array.isArray(arguments);\n}\nconsole.log(test(1, 2, 3));\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "false",
    explanation: "Inside non-arrow functions, `arguments` is a special array-like object (it has a `.length` and numerical indices), but it is NOT an actual `Array`. It lacks array methods like `.map()`, and `Array.isArray(arguments)` explicitly returns `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(\"aba\".replace(\"a\", \"c\"));\n```",
    options: JSON.stringify(["cba", "cbc", "aba", "Error"]),
    correctAnswer: "cba",
    explanation: "When the first argument to `String.prototype.replace()` is a literal string (instead of a global Regular Expression like `/a/g`), it ONLY replaces the very first occurrence it finds. Thus, only the first 'a' becomes 'c', yielding 'cba'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nvar funcs = [];\nfor (var i = 0; i < 2; i++) {\n  funcs.push(() => i);\n}\nconsole.log(funcs[0](), funcs[1]());\n```",
    options: JSON.stringify(["0 1", "2 2", "1 2", "Error"]),
    correctAnswer: "2 2",
    explanation: "This is the classic JavaScript Closure trap. The `var` keyword is function-scoped, not block-scoped. There is only ONE variable `i` shared by all the arrow functions. When the loop finishes, `i` is 2. Thus, both functions return 2. (Using `let` would correctly yield 0 1 by creating a new scope per iteration)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\ntry {\n  throw new Error();\n} catch {\n  console.log('Caught');\n}\n```",
    options: JSON.stringify(["Caught", "SyntaxError", "Error", "undefined"]),
    correctAnswer: "Caught",
    explanation: "This tests Optional Catch Binding, introduced in ES2019. Modern JavaScript allows you to completely omit the exception variable in a `catch` block (i.e., writing `catch { ... }` instead of `catch (e) { ... }`) if you don't need to inspect the error."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    raise SystemExit\nexcept Exception:\n    print(\"E\")\nexcept BaseException:\n    print(\"B\")\n```",
    options: JSON.stringify(["E", "B", "Error", "None"]),
    correctAnswer: "B",
    explanation: "In Python's exception hierarchy, `Exception` is the base class for standard program errors. However, critical system exceptions like `SystemExit` and `KeyboardInterrupt` inherit directly from `BaseException`, NOT `Exception`. Thus, the `Exception` block is skipped, and the `BaseException` block catches it."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ng = (x for x in range(3))\nprint(len(list(g)), len(list(g)))\n```",
    options: JSON.stringify(["3 3", "3 0", "Error", "0 0"]),
    correctAnswer: "3 0",
    explanation: "Generators in Python are single-use iterators. Once a generator is exhausted (which happens when `list(g)` consumes all its values the first time), it cannot be reset or reused. The second call to `list(g)` yields an empty list of length 0."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    x = 1\n\na = A()\na.x = 2\nprint(A.x, a.x)\n```",
    options: JSON.stringify(["1 2", "2 2", "1 1", "Error"]),
    correctAnswer: "1 2",
    explanation: "Assigning to an instance attribute (`a.x = 2`) creates or updates a variable exclusively within the instance's dictionary (`a.__dict__`). It does NOT mutate the class-level variable `A.x`. The instance variable effectively shadows the class variable."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {1: \"A\"}\ntry:\n    for k in d:\n        d[2] = \"B\"\n    print(\"Done\")\nexcept RuntimeError:\n    print(\"Error\")\n```",
    options: JSON.stringify(["Done", "Error", "None", "KeyError"]),
    correctAnswer: "Error",
    explanation: "In Python, you are strictly forbidden from modifying the size (adding or deleting keys) of a dictionary while you are actively iterating over it. Doing so immediately throws a `RuntimeError: dictionary changed size during iteration`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(0 or [] or 5 or 10)\n```",
    options: JSON.stringify(["True", "False", "5", "10"]),
    correctAnswer: "5",
    explanation: "The `or` operator in Python evaluates left-to-right and returns the EXACT VALUE of the FIRST truthy expression it encounters (short-circuiting). `0` and `[]` are falsy, but `5` is truthy, so it stops evaluating and returns the integer `5`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass Parent:\n    __slots__ = ['x']\n\nclass Child(Parent):\n    pass\n\nc = Child()\nc.y = 10\nprint(c.y)\n```",
    options: JSON.stringify(["10", "AttributeError", "Error", "None"]),
    correctAnswer: "10",
    explanation: "While `__slots__` prevents the creation of a `__dict__` to save memory, this restriction is NOT automatically inherited by subclasses. Because `Child` does not declare its own `__slots__`, it receives a normal `__dict__` and can freely accept arbitrary new attributes like `c.y`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(sum([], 10))\n```",
    options: JSON.stringify(["0", "10", "Error", "None"]),
    correctAnswer: "10",
    explanation: "The `sum(iterable, start)` function takes an optional `start` value, which defaults to 0. Since the iterable is an empty list `[]`, it simply returns the `start` value, which we explicitly set to 10."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nl = [1, 2, 3]\nl[1:2] = [4, 5, 6]\nprint(len(l))\n```",
    options: JSON.stringify(["3", "5", "4", "Error"]),
    correctAnswer: "5",
    explanation: "Python allows slice assignment to gracefully replace a segment of a list with an iterable of a completely DIFFERENT length, growing or shrinking the list as needed. The slice `l[1:2]` (which is just the element `2`) is replaced by `[4, 5, 6]`. The list becomes `[1, 4, 5, 6, 3]`, which has a length of 5."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nstruct S {\n    char a;\n    int b;\n    char c;\n};\nint main() {\n    std::cout << (sizeof(S) > 6);\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined"]),
    correctAnswer: "1",
    explanation: "Because of memory alignment (padding) for efficient CPU access, the compiler inserts empty padding bytes between struct members. `char a` (1 byte) gets 3 bytes of padding to align the 4-byte `int b`. `char c` gets 3 bytes of padding to align the total struct size to a multiple of 4. The size is typically 12 bytes, making `12 > 6` evaluate to 1 (true)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <string>\nint main() {\n    std::string s = \"Hello\";\n    std::move(s);\n    std::cout << s;\n    return 0;\n}\n```",
    options: JSON.stringify(["Hello", "Empty String", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Hello",
    explanation: "The `std::move()` function does absolutely nothing but safely cast an l-value to an r-value reference. Because the result of `std::move(s)` is never assigned to or used to construct a new object (which would trigger a move constructor), `s` is left completely intact."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v;\n    v.reserve(100);\n    std::cout << v.size();\n    return 0;\n}\n```",
    options: JSON.stringify(["0", "100", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "0",
    explanation: "The `reserve()` method exclusively allocates memory for the underlying capacity of the vector, allowing future `push_back` operations to avoid reallocations. However, it does NOT actually construct any elements. The logical `size()` of the vector remains 0."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Point {\n    int y;\n    int x;\npublic:\n    Point(int v) : x(v), y(x) {}\n    void print() { std::cout << y; }\n};\nint main() {\n    Point p(5);\n    p.print();\n    return 0;\n}\n```",
    options: JSON.stringify(["5", "Garbage", "Compiler Error", "0"]),
    correctAnswer: "Garbage (Undefined Behavior)",
    explanation: "This is an infamous C++ pitfall. Member variables are initialized strictly in the order they are DECLARED in the class block, NOT the order written in the constructor's initializer list. Since `y` is declared first, it initializes using `x` (which is still uninitialized garbage). Then `x` initializes to `v`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nnamespace {\n    void secret() { std::cout << \"S\"; }\n}\nint main() {\n    secret();\n    return 0;\n}\n```",
    options: JSON.stringify(["S", "Compiler Error", "Linker Error", "Undefined Behavior"]),
    correctAnswer: "S",
    explanation: "This uses an Unnamed (Anonymous) Namespace. It compiles and executes perfectly, printing 'S'. Anonymous namespaces are the modern C++ equivalent of the `static` keyword in C; they give the functions inside them internal linkage, hiding them from other translation units (files)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Data {\npublic:\n    void destroy() { delete this; }\n    void print() { std::cout << \"D\"; }\n};\nint main() {\n    Data* ptr = new Data();\n    ptr->destroy();\n    return 0;\n}\n```",
    options: JSON.stringify(["No Output", "D", "Compiler Error", "Runtime Crash"]),
    correctAnswer: "No Output",
    explanation: "Calling `delete this;` is legal in C++ as long as the object was dynamically allocated with `new`. Since we immediately exit `main` without accessing any member variables of the deleted object, the code safely completes with no output."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A {};\nclass B : virtual public A {};\nclass C : virtual public A {};\nclass D : public B, public C {};\nint main() {\n    std::cout << \"Done\";\n    return 0;\n}\n```",
    options: JSON.stringify(["Done", "Compiler Error", "Undefined Behavior", "Linker Error"]),
    correctAnswer: "Done",
    explanation: "This is the classic solution to the Multiple Inheritance Diamond Problem. By using `virtual public A` for the intermediate classes `B` and `C`, C++ ensures that the final derived class `D` inherits exactly ONE shared instance of the base class `A`, rather than two ambiguous copies."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String text = \"a.b\";\n        System.out.println(text.replaceAll(\".\", \"x\"));\n    }\n}\n```",
    options: JSON.stringify(["a.b", "axb", "xxx", "Compile Error"]),
    correctAnswer: "xxx",
    explanation: "The `replaceAll()` method in Java expects a Regular Expression, not a literal string. In RegEx, the dot `.` matches ANY character. Therefore, it replaces every single character in the string with 'x', producing 'xxx'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    static { System.out.print(\"B\"); }\n}\npublic class Main extends Base {\n    static { System.out.print(\"M\"); }\n    public static void main(String[] args) {}\n}\n```",
    options: JSON.stringify(["M", "BM", "MB", "No Output"]),
    correctAnswer: "BM",
    explanation: "When a class is loaded by the JVM (which happens right before `main` executes), it must first load the Parent class before the Child class. Therefore, the Parent's `static` initialization block runs ('B'), followed by the Child's `static` block ('M')."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    static void run() { System.out.print(\"S\"); }\n    public static void main(String[] args) {\n        Main obj = null;\n        obj.run();\n    }\n}\n```",
    options: JSON.stringify(["S", "NullPointerException", "Compile Error", "No Output"]),
    correctAnswer: "S",
    explanation: "Because `run()` is a `static` method, the Java compiler statically resolves the method call using the REFERENCE TYPE (`Main`), completely ignoring the actual instance data. Therefore, invoking it on a `null` reference succeeds without throwing a `NullPointerException`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(1 + 2 + \"3\" + 4 + 5);\n    }\n}\n```",
    options: JSON.stringify(["15", "3345", "12345", "339"]),
    correctAnswer: "3345",
    explanation: "The `+` operator evaluates left-to-right. `1 + 2` is integer arithmetic (3). `3 + \"3\"` triggers string concatenation (\"33\"). Once the result is a string, all subsequent `+` operations become string concatenations: `\"33\" + 4` -> `\"334\"`, and `\"334\" + 5` -> `\"3345\"`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> i = new ArrayList<>();\n        List<String> s = new ArrayList<>();\n        System.out.println(i.getClass() == s.getClass());\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "This highlights Java's Generics Type Erasure. At compile time, generics enforce type safety. However, at runtime, all generic type parameters (`<Integer>`, `<String>`) are completely erased. Both variables simply point to the exact same raw `ArrayList.class` object."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        int amount = 1_000_000;\n        int error = _100;\n    }\n}\n```",
    options: JSON.stringify(["1000000", "Compile Error", "Runtime Error", "No Output"]),
    correctAnswer: "Compile Error",
    explanation: "Java 7 introduced the ability to use underscores `_` in numeric literals to improve readability (like `1_000_000`). However, an underscore CANNOT be placed at the very beginning or end of a literal. `_100` is parsed as an invalid variable identifier instead of a number, causing a compile error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code (Java 9+)?\n```java\ninterface Helper {\n    private void run() { System.out.print(\"R\"); }\n    default void execute() { run(); }\n}\npublic class Main implements Helper {\n    public static void main(String[] args) {\n        new Main().execute();\n    }\n}\n```",
    options: JSON.stringify(["R", "Compile Error", "Runtime Error", "No Output"]),
    correctAnswer: "R",
    explanation: "Starting in Java 9, Interfaces are legally allowed to contain `private` methods. These are extremely useful for extracting shared logic out of multiple `default` methods without exposing that internal logic to implementing classes. It compiles and prints 'R'."
  },
  // --- BATCH 14: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([NaN].includes(NaN), [NaN].indexOf(NaN));\n```",
    options: JSON.stringify(["true -1", "false -1", "true 0", "false 0"]),
    correctAnswer: "true -1",
    explanation: "These two array methods use different equality algorithms. `.includes()` uses the 'SameValueZero' algorithm, which correctly identifies `NaN` as equal to `NaN` (returns true). However, `.indexOf()` uses strict equality (`===`), and in JavaScript `NaN === NaN` is false, so it fails to find it (returns -1)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nPromise.resolve(1)\n  .then(() => 2)\n  .finally(() => 3)\n  .then(console.log);\n```",
    options: JSON.stringify(["3", "2", "1", "undefined"]),
    correctAnswer: "2",
    explanation: "The `.finally()` method executes a callback when a promise settles, but it is entirely \"transparent\" to the promise chain. It deliberately ignores its own return value (`3`) and perfectly passes through the previous settled value (`2`) to the next `.then()`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst arr = [1, 2, ,];\nconsole.log(arr.length);\n```",
    options: JSON.stringify(["3", "2", "4", "Error"]),
    correctAnswer: "3",
    explanation: "JavaScript intentionally ignores \"trailing commas\" in array (and object) literals. However, the empty space between the first and second comma DOES count as an empty slot. Thus, the array has elements at index 0, 1, and an empty slot at 2. The length is 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nvar x = 10;\ndelete x;\nconsole.log(x);\n```",
    options: JSON.stringify(["10", "undefined", "ReferenceError", "null"]),
    correctAnswer: "10",
    explanation: "The `delete` operator is specifically designed to remove properties from objects. It cannot delete standard variables declared with `var`, `let`, or `const`. The deletion fails silently (or throws in strict mode), leaving `x` fully intact."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(Number.MIN_VALUE > 0);\n```",
    options: JSON.stringify(["true", "false", "Error", "undefined"]),
    correctAnswer: "true",
    explanation: "Unlike `Number.MAX_VALUE`, `Number.MIN_VALUE` does NOT represent the most negative possible number. Instead, it represents the smallest possible POSITIVE floating-point number closest to zero (approximately 5e-324). Because it is strictly positive, `MIN_VALUE > 0` is true."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([] + []);\nconsole.log([1] + [2]);\n```",
    options: JSON.stringify(["(empty line)\\n12", "[]\\n[1, 2]", "0\\n3", "NaN\\nNaN"]),
    correctAnswer: "(empty line)\\n12",
    explanation: "The `+` operator coerces arrays to strings before combining them. An empty array coerces to an empty string `\"\"`, so `[] + []` yields `\"\"`. `[1]` coerces to `\"1\"` and `[2]` coerces to `\"2\"`, which concatenate to form the string `\"12\"`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst nums = [1, 2];\nnums.forEach(async (n) => {\n  await new Promise(r => setTimeout(r, 10));\n});\nconsole.log(\"Done\");\n```",
    options: JSON.stringify(["Done", "Error", "(Waits 10ms) Done", "undefined"]),
    correctAnswer: "Done",
    explanation: "The built-in `Array.prototype.forEach()` method is NOT promise-aware. It fires off the asynchronous callbacks synchronously and immediately moves on to the next instruction without waiting for any `await` statements inside them. \"Done\" prints immediately."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log([...\"ab\"].length);\n```",
    options: JSON.stringify(["2", "1", "3", "Error"]),
    correctAnswer: "2",
    explanation: "Strings in JavaScript are iterable. The spread operator `...` iterates over the string, breaking it into an array of individual UTF-16 code units (characters). It creates the array `['a', 'b']`, which has a length of 2."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nx = 1\ndef func():\n    print(x)\n    x = 2\n\ntry:\n    func()\nexcept UnboundLocalError:\n    print(\"Error\")\n```",
    options: JSON.stringify(["Error", "1", "2", "None"]),
    correctAnswer: "Error",
    explanation: "Python statically determines variable scope at compile-time. Because `x = 2` exists ANYWHERE inside the function body, Python aggressively flags `x` as a strictly LOCAL variable for the entire function. When `print(x)` executes before the assignment, it crashes with an `UnboundLocalError`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(round(1.5), round(2.5))\n```",
    options: JSON.stringify(["2 2", "2 3", "1 3", "1 2"]),
    correctAnswer: "2 2",
    explanation: "Python 3 uses \"Banker's Rounding\" (Round half to even). When a number is exactly halfway between two integers (like .5), it ALWAYS rounds to the nearest EVEN integer. Thus, 1.5 rounds up to 2, and 2.5 rounds down to 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    x = 1\nclass B:\n    x = 2\nclass C(A, B):\n    pass\n\nprint(C.x)\n```",
    options: JSON.stringify(["1", "2", "Error", "None"]),
    correctAnswer: "1",
    explanation: "Python handles Multiple Inheritance using the C3 Linearization Method Resolution Order (MRO). Because `A` is listed before `B` in the class definition `class C(A, B)`, Python searches `A` first. It finds `x=1` and immediately returns it without ever checking `B`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    pass\nexcept Exception:\n    print(\"E\", end=\"\")\nelse:\n    print(\"L\", end=\"\")\nfinally:\n    print(\"F\", end=\"\")\n```",
    options: JSON.stringify(["LF", "F", "ELF", "Error"]),
    correctAnswer: "LF",
    explanation: "In a `try/except/else/finally` block, the `else` block executes ONLY if the `try` block completes successfully without raising ANY exceptions. It runs after the `try`, but BEFORE the `finally` block. So 'L' prints, followed by 'F'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nimport copy\na = [[1]]\nb = copy.copy(a)\nb[0][0] = 2\nprint(a[0][0])\n```",
    options: JSON.stringify(["2", "1", "Error", "None"]),
    correctAnswer: "2",
    explanation: "The `copy.copy()` function creates a SHALLOW copy of a list. It duplicates the outer list, but the inner list references remain identical between `a` and `b`. Modifying `b[0][0]` mutates the shared inner list, modifying `a` as well."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(print(1))\n```",
    options: JSON.stringify(["1\\nNone", "1", "1\\n1", "Error"]),
    correctAnswer: "1\\nNone",
    explanation: "The inner `print(1)` executes first, printing the integer '1' to standard output. Like all Python functions that lack an explicit `return` statement, `print()` returns `None`. The outer `print()` then prints that return value, resulting in 'None'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ns1 = \"a\"\nid1 = id(s1)\ns1 += \"b\"\nid2 = id(s1)\nprint(id1 == id2)\n```",
    options: JSON.stringify(["False", "True", "Error", "None"]),
    correctAnswer: "False",
    explanation: "Strings in Python are strictly immutable. The `+=` operator does NOT mutate the existing string in memory. Instead, it allocates a completely new string object (`\"ab\"`) and reassigns the variable `s1` to point to the new memory address. Therefore, the memory IDs are different."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(max([\"a\", \"abc\", \"ab\"], key=len))\n```",
    options: JSON.stringify(["abc", "a", "ab", "Error"]),
    correctAnswer: "abc",
    explanation: "The `max()` function normally compares values alphabetically when given strings. However, by providing `key=len`, it applies the `len()` function to each element BEFORE comparing them. It finds the string with the longest length, returning 'abc'."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int a = 1, b = 2;\n    int& ref = a;\n    ref = b;\n    std::cout << a;\n    return 0;\n}\n```",
    options: JSON.stringify(["2", "1", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "2",
    explanation: "In C++, references CANNOT be re-seated to point to a different variable after they are initialized. The statement `ref = b;` does NOT change what `ref` points to; instead, it acts as an alias for `a = b;`, overwriting the value of `a` with 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A {\npublic:\n    A(int x) {}\n};\nint main() {\n    A obj;\n    return 0;\n}\n```",
    options: JSON.stringify(["Compiler Error", "No Output", "Undefined Behavior", "Linker Error"]),
    correctAnswer: "Compiler Error",
    explanation: "If a C++ class has NO constructors defined, the compiler automatically synthesizes a default (no-argument) constructor. However, the moment you explicitly define ANY constructor (like `A(int x)`), the compiler refuses to generate the default constructor. `A obj;` fails because no default constructor exists."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual void f(int x = 1) { std::cout << \"B\" << x; }\n};\nclass Derived : public Base {\npublic:\n    void f(int x = 2) override { std::cout << \"D\" << x; }\n};\nint main() {\n    Base* p = new Derived();\n    p->f();\n    return 0;\n}\n```",
    options: JSON.stringify(["D1", "D2", "B1", "B2"]),
    correctAnswer: "D1",
    explanation: "This is a notoriously evil C++ trap. Virtual functions are resolved dynamically at runtime (so `Derived::f` executes, printing 'D'). However, default arguments are resolved STATICALLY at compile-time based on the pointer type! Because the pointer is `Base*`, it injects the default argument `1` into the derived function."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\n#include <vector>\nint main() {\n    std::vector<int> v(10, 1);\n    v.clear();\n    std::cout << v.capacity();\n    return 0;\n}\n```",
    options: JSON.stringify(["10", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "10",
    explanation: "The `std::vector::clear()` method destroys all elements and sets the logical size to 0. Crucially, it does NOT deallocate the underlying heap memory array. The capacity remains at its previous maximum (10) to optimize future insertions."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nvoid counter() {\n    static int x = 0;\n    std::cout << ++x;\n}\nint main() {\n    counter();\n    counter();\n    return 0;\n}\n```",
    options: JSON.stringify(["12", "11", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "12",
    explanation: "A `static` variable declared inside a function is initialized precisely once and strictly retains its memory and value across multiple calls to that function. The first call increments it to 1, and the second call increments the same persistent integer to 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int* arr = new int[5];\n    delete arr;\n    std::cout << \"Done\";\n    return 0;\n}\n```",
    options: JSON.stringify(["Done (Undefined Behavior)", "Compiler Error", "Linker Error", "Garbage"]),
    correctAnswer: "Done (Undefined Behavior)",
    explanation: "When you allocate memory with `new[]`, you MUST deallocate it using `delete[]`. Using standard `delete` on an array pointer invokes strictly Undefined Behavior. In most implementations, it only calls the destructor of the first element in the array and leaks the rest, but it usually prints 'Done' and silently leaks."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    double x = 1.0 / 0.0;\n    std::cout << (x > 0);\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Runtime Crash", "Compiler Error"]),
    correctAnswer: "1",
    explanation: "Unlike integer division by zero (which causes an immediate fatal runtime crash), floating-point division by zero is defined by the IEEE 754 standard. `1.0 / 0.0` perfectly evaluates to positive `Infinity`. Because `Infinity > 0` is true, it safely outputs 1."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    static void print(Integer x) { System.out.print(\"Wrapper\"); }\n    static void print(long x) { System.out.print(\"Primitive\"); }\n    public static void main(String[] args) {\n        print(5);\n    }\n}\n```",
    options: JSON.stringify(["Primitive", "Wrapper", "Compile Error", "Runtime Error"]),
    correctAnswer: "Primitive",
    explanation: "In Java Method Overloading resolution, the compiler strictly prefers widening a primitive (converting the `int` 5 to a `long`) OVER autoboxing the primitive into an Object wrapper (converting the `int` to an `Integer`). Therefore, `print(long x)` wins."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Integer x = new Integer(10);\n        Integer y = new Integer(10);\n        System.out.println(x == y);\n    }\n}\n```",
    options: JSON.stringify(["false", "true", "Compile Error", "Runtime Error"]),
    correctAnswer: "false",
    explanation: "While Java caches small Integers during autoboxing (e.g., `Integer x = 10`), using the explicit `new` keyword completely bypasses this cache. It forces the JVM to allocate two entirely distinct objects on the heap. Because `==` checks memory addresses for objects, it returns `false`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Integer x = 5;\n        x++;\n        System.out.println(x);\n    }\n}\n```",
    options: JSON.stringify(["6", "5", "Compile Error", "Runtime Error"]),
    correctAnswer: "6",
    explanation: "The `++` operator perfectly works on Wrapper classes. Under the hood, Java automatically unboxes `x` to the primitive `5`, increments the primitive to `6`, and then autoboxes the new value by allocating or fetching a brand new `Integer` object and reassigning the reference."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.Arrays;\npublic class Main {\n    public static void main(String[] args) {\n        String[] parts = \"a,,b\".split(\",\");\n        System.out.println(parts.length);\n    }\n}\n```",
    options: JSON.stringify(["3", "2", "4", "Compile Error"]),
    correctAnswer: "3",
    explanation: "The `.split(\",\")` method strictly splits on every comma. The first comma separates 'a' from the space between commas. The second comma separates the space between commas from 'b'. Thus, the resulting array is `[\"a\", \"\", \"b\"]`, which has a length of 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s1 = new String(\"Hi\").intern();\n        String s2 = \"Hi\";\n        System.out.println(s1 == s2);\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "The `.intern()` method queries the Java String Constant Pool. If the exact string content exists in the pool, it returns the shared pool reference. Since `s2 = \"Hi\"` automatically uses the pool, `s1` and `s2` point to the exact same cached object in memory."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Parent { int x = 1; }\nclass Child extends Parent { int x = 2; }\npublic class Main {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.print(p.x);\n    }\n}\n```",
    options: JSON.stringify(["1", "2", "Compile Error", "Runtime Error"]),
    correctAnswer: "1",
    explanation: "In Java, instance methods are fully Polymorphic (resolved dynamically at runtime). However, Member VARIABLES are strictly resolved STATICALLY based on the reference type of the variable! Because `p` is of type `Parent`, the compiler directly accesses `Parent.x`, printing 1."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\ninterface A {}\ninterface B {}\ninterface C extends A, B {}\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(\"Done\");\n    }\n}\n```",
    options: JSON.stringify(["Done", "Compile Error", "Runtime Error", "No Output"]),
    correctAnswer: "Done",
    explanation: "While a standard Java class is strictly limited to extending only ONE class, Java explicitly allows an Interface to `extend` MULTIPLE interfaces simultaneously. The code perfectly compiles and executes."
  },
  // --- BATCH 15: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = [10, 20];\nconsole.log(a.push(30));\n```",
    options: JSON.stringify(["[10, 20, 30]", "3", "30", "undefined"]),
    correctAnswer: "3",
    explanation: "The `Array.prototype.push()` method modifies the array in place, but it does NOT return the modified array. Instead, it returns the NEW `length` property of the array. The new length is 3."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst s = Symbol('key');\nconst obj = { [s]: 1, b: 2 };\nconsole.log(Object.keys(obj).length, Reflect.ownKeys(obj).length);\n```",
    options: JSON.stringify(["1 1", "2 2", "1 2", "2 1"]),
    correctAnswer: "1 2",
    explanation: "Methods like `Object.keys()` and `for...in` loops completely ignore `Symbol` properties by design. Thus, `Object.keys()` only finds 'b' (length 1). However, `Reflect.ownKeys()` returns ALL keys, including strings and Symbols, returning both (length 2)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(-2 ** 2);\n```",
    options: JSON.stringify(["-4", "4", "SyntaxError", "NaN"]),
    correctAnswer: "SyntaxError",
    explanation: "In JavaScript, the exponentiation operator `**` has very high precedence, but the language strictly forbids an ambiguous unary operator (like `-`) immediately before it without parentheses. You MUST write `-(2 ** 2)` or `(-2) ** 2` to resolve the ambiguity, otherwise it is a SyntaxError."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\n[].reduce((a, b) => a + b);\nconsole.log(\"Done\");\n```",
    options: JSON.stringify(["Done", "undefined", "TypeError", "NaN"]),
    correctAnswer: "TypeError",
    explanation: "Calling `Array.prototype.reduce()` on an empty array without providing an initial value throws a strictly enforced `TypeError: Reduce of empty array with no initial value`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst wm = new WeakMap();\ntry {\n    wm.set(\"key\", 1);\n    console.log(\"Done\");\n} catch (e) {\n    console.log(\"Error\");\n}\n```",
    options: JSON.stringify(["Done", "Error", "undefined", "null"]),
    correctAnswer: "Error",
    explanation: "A `WeakMap` strictly requires its keys to be garbage-collectable objects (or non-registered Symbols). Primitive values like strings (`\"key\"`), numbers, or booleans cannot be garbage collected in the same way and will throw a `TypeError: Invalid value used as weak map key`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst getObj = () => { a: 1 };\nconsole.log(getObj());\n```",
    options: JSON.stringify(["{ a: 1 }", "undefined", "SyntaxError", "1"]),
    correctAnswer: "undefined",
    explanation: "This is a notorious arrow function syntax trap. The curly braces `{}` are interpreted as the function's block scope, NOT an object literal. Inside the block, `a:` is parsed as a label, and `1` is an expression. Because there is no explicit `return` keyword, the function returns `undefined`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(typeof Date(), typeof new Date());\n```",
    options: JSON.stringify(["object object", "string string", "string object", "object string"]),
    correctAnswer: "string object",
    explanation: "When you call `Date()` as a regular function (without `new`), it ignores any arguments and simply returns a primitive String representing the current date and time. When called as a constructor with `new Date()`, it returns a true Date Object."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  yield 1;\n  yield 2;\n}\nconst g = gen();\ng.next();\nconsole.log(g.return(3).value);\n```",
    options: JSON.stringify(["1", "2", "3", "undefined"]),
    correctAnswer: "3",
    explanation: "The `generator.return(value)` method forcibly terminates the generator, sets it to a closed state, and immediately yields the provided value. Even though there were more `yield` statements available, it overrides them and returns 3."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\na = [1, 2, 1]\na.remove(1)\nprint(a)\n```",
    options: JSON.stringify(["[2]", "[2, 1]", "[1, 2]", "Error"]),
    correctAnswer: "[2, 1]",
    explanation: "The `list.remove(value)` method strictly searches for and removes ONLY the very first occurrence of the specified value. It deletes the first `1`, leaving the rest of the list `[2, 1]` intact."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass A:\n    x = 10\n\nobj = A()\nprint('x' in obj.__dict__)\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "False",
    explanation: "The instance dictionary `__dict__` ONLY holds variables that are explicitly bound to the instance itself. Because `x` was defined at the class level, it resides in `A.__dict__`, not `obj.__dict__`. While `obj.x` successfully finds it via the prototype-like chain, it is strictly False that it exists inside the instance dictionary."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {2: \"b\", 1: \"a\"}\nprint(sorted(d))\n```",
    options: JSON.stringify(["['a', 'b']", "[1, 2]", "[{1: 'a', 2: 'b'}]", "Error"]),
    correctAnswer: "[1, 2]",
    explanation: "When you pass a dictionary to the `sorted()` function (or iterate over it generally), Python only looks at the KEYS by default. It sorts the keys numerically and returns a new list containing just the sorted keys: `[1, 2]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code (Python 3.8+)?\n```python\nif any((n := x) > 0 for x in [-1, 2]):\n    print(n)\n```",
    options: JSON.stringify(["2", "True", "-1", "Error"]),
    correctAnswer: "2",
    explanation: "The Walrus Operator `:=` (Assignment Expression) evaluates an expression and assigns it to a variable simultaneously. Crucially, variables assigned via the walrus operator INSIDE a comprehension strictly \"leak\" out into the surrounding scope! Thus, `n` escapes the comprehension as `2` and can be printed safely."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    d = dict(**{1: \"a\"})\n    print(d)\nexcept TypeError:\n    print(\"Error\")\n```",
    options: JSON.stringify(["{1: 'a'}", "Error", "{'1': 'a'}", "None"]),
    correctAnswer: "Error",
    explanation: "When using the `**` operator to unpack a dictionary into keyword arguments (kwargs) for a function call, Python strictly enforces that all keys MUST be strings. Because `1` is an integer, it fails with a `TypeError: keywords must be strings`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(\"1a\".isidentifier(), \"a1\".isidentifier())\n```",
    options: JSON.stringify(["True True", "False False", "False True", "True False"]),
    correctAnswer: "False True",
    explanation: "The `.isidentifier()` string method checks if a string is a valid Python variable name. Variable names can contain letters, numbers, and underscores, but they CANNOT start with a number. Thus, `1a` is False, and `a1` is True."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nclass MyInt(int):\n    pass\n\na = MyInt(2)\nb = MyInt(3)\nprint(type(a + b).__name__)\n```",
    options: JSON.stringify(["MyInt", "int", "Error", "None"]),
    correctAnswer: "int",
    explanation: "When you subclass a built-in immutable type like `int` and perform arithmetic operations (`+`) on it, Python delegates to the underlying C implementation. The C implementation returns a standard `int` object, NOT an instance of your subclass `MyInt`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(-5 % 3)\n```",
    options: JSON.stringify(["-2", "2", "1", "-1"]),
    correctAnswer: "1",
    explanation: "The modulo operator in Python always yields a result with the same mathematical sign as the Divisor (the right operand, 3). The formula is `a - (n * floor(a/n))`. `-5 // 3` floors to `-2`. `-2 * 3` is `-6`. `-5 - (-6)` is `1`."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nenum class Color { Red = 5 };\nint main() {\n    int x = Color::Red;\n    std::cout << x;\n    return 0;\n}\n```",
    options: JSON.stringify(["5", "Compiler Error", "Undefined Behavior", "0"]),
    correctAnswer: "Compiler Error",
    explanation: "Unlike traditional C-style enums (`enum Color`), modern C++ Scoped Enums (`enum class Color`) strictly disable implicit type conversions to integers. To assign it to an integer, you MUST explicitly cast it: `static_cast<int>(Color::Red)`. It fails to compile."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Object {\npublic:\n    void print() & { std::cout << \"L\"; }\n};\nint main() {\n    Object().print();\n    return 0;\n}\n```",
    options: JSON.stringify(["L", "Compiler Error", "Undefined Behavior", "Garbage"]),
    correctAnswer: "Compiler Error",
    explanation: "The `&` (reference qualifier) at the end of the member function strictly enforces that the method can ONLY be called on l-values (persistent, named objects). Because `Object()` creates a temporary, unnamed r-value object, the compiler blocks the method call."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    int arr[] = {1, 2, 3};\n    int* ptr = arr;\n    for (int x : ptr) {\n        std::cout << x;\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["123", "Compiler Error", "Undefined Behavior", "1"]),
    correctAnswer: "Compiler Error",
    explanation: "A range-based `for` loop heavily relies on `std::begin()` and `std::end()` to determine the boundaries of the container. While a native array `int arr[]` retains its size information, a decayed pointer `int* ptr` has lost all size information. The compiler cannot deduce the bounds and fails."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nconstexpr int add(int a) {\n    return a + 1;\n}\nint main() {\n    int x = 5;\n    std::cout << add(x);\n    return 0;\n}\n```",
    options: JSON.stringify(["6", "Compiler Error", "Undefined Behavior", "0"]),
    correctAnswer: "6",
    explanation: "A `constexpr` function is a hint that the function CAN be evaluated at compile-time. However, if it is invoked with runtime variables (like `x`, which is not `constexpr`), the compiler safely degrades it to a normal runtime function. It compiles perfectly and outputs 6."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code (C++17 or later)?\n```cpp\n#include <iostream>\nint main() {\n    bool b = true;\n    b++;\n    std::cout << b;\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "2", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Compiler Error",
    explanation: "Post-incrementing a boolean was deprecated in C++98 and completely, fully REMOVED from the language standard in C++17. Attempting to use `b++` on a boolean in modern C++ causes a hard compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Global {\npublic:\n    ~Global() { std::cout << \"G\"; }\n};\nint main() {\n    static Global g;\n    std::cout << \"M\";\n    return 0;\n}\n```",
    options: JSON.stringify(["MG", "GM", "M", "Compiler Error"]),
    correctAnswer: "MG",
    explanation: "Local `static` variables inside functions are initialized the first time control passes through their declaration. However, their destructors are delayed and called automatically by the C++ runtime strictly AFTER the `main()` function entirely terminates. Thus, 'M' prints before 'G'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    try {\n        throw 5.5;\n    } catch (int e) {\n        std::cout << \"I\";\n    } catch (...) {\n        std::cout << \"A\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["I", "A", "IA", "Compiler Error"]),
    correctAnswer: "A",
    explanation: "Unlike normal function overloading, C++ exceptions do NOT perform implicit type conversions (like converting the `double` 5.5 into an `int`). The `catch (int)` block strictly rejects the double. The \"catch-all\" block `catch (...)` safely intercepts it, printing 'A'."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Thread t = new Thread(() -> System.out.print(\"Run\"));\n        t.run();\n        System.out.print(\"Done\");\n    }\n}\n```",
    options: JSON.stringify(["RunDone", "DoneRun", "Compile Error", "Runtime Error"]),
    correctAnswer: "RunDone",
    explanation: "Calling the `.run()` method on a Thread directly does NOT spawn a new operating system thread. It simply executes the `run` method synchronously within the exact same calling thread. Therefore, execution is strictly sequential, and 'Run' is absolutely guaranteed to print before 'Done'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> list = new ArrayList<>();\n        list.add(10);\n        list.add(20);\n        list.remove(10);\n        System.out.print(list.size());\n    }\n}\n```",
    options: JSON.stringify(["1", "2", "IndexOutOfBoundsException", "Compile Error"]),
    correctAnswer: "IndexOutOfBoundsException",
    explanation: "The `remove()` method in `List` is overloaded: `remove(int index)` and `remove(Object o)`. When you pass the primitive `10`, Java prefers the exact primitive match `remove(int index)` over boxing it to `remove(Object)`. Because index 10 is out of bounds, it crashes."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base {\n    void execute() throws Exception {}\n}\nclass Derived extends Base {\n    void execute() throws Throwable {}\n}\npublic class Main {\n    public static void main(String[] args) {}\n}\n```",
    options: JSON.stringify(["Compile Error", "Runs Successfully", "Runtime Error", "No Output"]),
    correctAnswer: "Compile Error",
    explanation: "In Java, an overridden method in a subclass CANNOT throw a checked exception that is broader or higher in the hierarchy than the one declared by the parent class. Because `Throwable` is a broader superclass of `Exception`, the compiler strictly rejects it to ensure polymorphic safety."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.print(String.join(\"-\", \"A\", \"B\"));\n    }\n}\n```",
    options: JSON.stringify(["A-B", "A,B", "Compile Error", "Runtime Error"]),
    correctAnswer: "A-B",
    explanation: "The static `String.join(delimiter, elements...)` method easily merges multiple strings (or an iterable of strings) using the provided delimiter. It securely joins 'A' and 'B' with a hyphen, resulting in 'A-B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        Integer val = null;\n        switch (val) {\n            case 1: System.out.print(\"1\");\n            default: System.out.print(\"D\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["D", "NullPointerException", "Compile Error", "No Output"]),
    correctAnswer: "NullPointerException",
    explanation: "Switch statements support Wrapper classes (like `Integer`) by automatically unboxing them to primitives at runtime to perform the comparisons. Because `val` is strictly `null`, the unboxing process throws a `NullPointerException` before the switch can even evaluate."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        block: {\n            System.out.print(\"A\");\n            if (true) break block;\n            System.out.print(\"B\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["A", "AB", "Compile Error", "Runtime Error"]),
    correctAnswer: "A",
    explanation: "Java does not have a `goto` statement, but it DOES support labeled blocks. You can attach a label to an arbitrary code block `{}` and use `break label;` to jump completely out of it. It successfully jumps out before printing 'B'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3};\n        System.out.println(arr.getClass().isArray());\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "In Java, arrays are true runtime objects. They are dynamically generated subclasses of `Object` implicitly provided by the JVM. Therefore, you can call `.getClass()` on an array and use reflection methods like `.isArray()`, which securely returns `true`."
  },
  // --- BATCH 16: 30 HIGH QUALITY BIG TECH QUESTIONS ---
  // JavaScript
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction test() {\n  try {\n    return 1;\n  } finally {\n    return 2;\n  }\n}\nconsole.log(test());\n```",
    options: JSON.stringify(["1", "2", "Error", "undefined"]),
    correctAnswer: "2",
    explanation: "The `finally` block ALWAYS executes before a function exits. If the `finally` block contains a `return` statement, it completely overwrites and overrides any `return` statement that was executed in the `try` or `catch` block."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = { x: 1 };\nconst b = { x: 2, ...a };\nconsole.log(b.x);\n```",
    options: JSON.stringify(["2", "1", "undefined", "Error"]),
    correctAnswer: "1",
    explanation: "When using the object spread syntax `{ ...a }`, properties are evaluated strictly from left to right. Because `...a` (which contains `x: 1`) appears AFTER `x: 2`, it overwrites the previous value of `x`, making the final value 1."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst set = new Set([{}, {}]);\nconsole.log(set.size);\n```",
    options: JSON.stringify(["1", "2", "0", "undefined"]),
    correctAnswer: "2",
    explanation: "A JavaScript `Set` determines uniqueness based on object memory references (using the SameValueZero algorithm), NOT object deep equality. Because the two `{}` literals allocate two entirely distinct objects in memory, the Set considers them unique."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\ntry {\n  console.log(1.toString());\n} catch (e) {\n  console.log(\"Error\");\n}\n```",
    options: JSON.stringify(["1", "Error", "undefined", "NaN"]),
    correctAnswer: "Error",
    explanation: "This throws a `SyntaxError` at parse time (caught as \"Error\" if wrapped/evaled, or fails immediately). When the JavaScript parser sees a number followed by a dot, it strictly assumes the dot is a decimal point for a float. Thus `1.` is parsed as the number 1, leaving `toString()` dangling with a syntax error. (You must use `1..toString()` or `(1).toString()`)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = [1, 2, 3];\na.length = 0;\nconsole.log(a[0]);\n```",
    options: JSON.stringify(["1", "0", "undefined", "Error"]),
    correctAnswer: "undefined",
    explanation: "In JavaScript, the `.length` property of an array is not just a getter; it is a writable setter that truncates the array. Manually setting `a.length = 0` instantly deletes all elements from the array. Accessing index 0 afterward yields `undefined`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconst a = [1, 2];\nconst b = a.reverse();\nb.push(3);\nconsole.log(a.length);\n```",
    options: JSON.stringify(["2", "3", "0", "undefined"]),
    correctAnswer: "3",
    explanation: "The `Array.prototype.reverse()` method does NOT create a copy of the array. It mutates the original array strictly IN-PLACE and returns a reference to that exact same array. Thus, `a` and `b` point to the same array in memory. Pushing to `b` modifies `a`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nfunction* gen() {\n  try {\n    yield 1;\n  } catch (e) {\n    yield 2;\n  }\n}\nconst g = gen();\ng.next();\nconsole.log(g.throw(new Error()).value);\n```",
    options: JSON.stringify(["1", "2", "Error", "undefined"]),
    correctAnswer: "2",
    explanation: "The `generator.throw()` method intentionally injects an exception into the generator strictly at the location of the last `yield` statement. The generator's internal `catch` block intercepts the injected error, executes, and yields the number 2."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "JavaScript",
    prompt: "What is the output of the following JavaScript code?\n```javascript\nconsole.log(\"aba\".match(/a/).length);\n```",
    options: JSON.stringify(["2", "1", "3", "Error"]),
    correctAnswer: "1",
    explanation: "When calling `.match()` with a Regular Expression that lacks the global `/g` flag, it ONLY returns an array containing the very first match (along with capture groups and index metadata). The array length is 1. (If it were `/a/g`, it would return `['a', 'a']` with length 2)."
  },
  // Python
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = {1: 1}\nfor k, v in d.items():\n    d[k] = 2\nprint(d[1])\n```",
    options: JSON.stringify(["1", "2", "Error", "None"]),
    correctAnswer: "2",
    explanation: "While Python strictly forbids modifying the SIZE (adding/removing keys) of a dictionary during iteration, it perfectly allows modifying the VALUES of strictly existing keys. The assignment `d[k] = 2` succeeds safely."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint([1, 2, 3, 4][-3:-1])\n```",
    options: JSON.stringify(["[2, 3]", "[2, 3, 4]", "[3, 4]", "Error"]),
    correctAnswer: "[2, 3]",
    explanation: "Python slices `[start:stop]` exclude the `stop` index. Negative indices count from the end, where `-1` is the last element (4) and `-3` is the element (2). Thus, it slices from 2 (inclusive) to 4 (exclusive), returning `[2, 3]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(isinstance(True, (int, float)))\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "In Python's internal type hierarchy, the `bool` class is actually a direct subclass of the `int` class. Therefore, `isinstance(True, int)` evaluates to True. The `isinstance` function safely checks against the tuple of classes and returns True."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint({1, 2} ^ {2, 3})\n```",
    options: JSON.stringify(["{1, 2, 3}", "{2}", "{1, 3}", "Error"]),
    correctAnswer: "{1, 3}",
    explanation: "For Python `set` objects, the caret `^` operator represents the Symmetric Difference (XOR). It returns a new set containing strictly elements that exist in exactly one of the sets, but NOT in both. It removes the shared `2` and leaves `{1, 3}`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nprint(bool(\"False\"))\n```",
    options: JSON.stringify(["True", "False", "Error", "None"]),
    correctAnswer: "True",
    explanation: "The `bool()` function evaluates the \"truthiness\" of an object. In Python, strictly ANY non-empty string is considered Truthy, regardless of its English meaning. Because `\"False\"` is a string with 5 characters, it evaluates to `True`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\ntry:\n    eval(\"x = 1\")\n    print(\"Done\")\nexcept SyntaxError:\n    print(\"Error\")\n```",
    options: JSON.stringify(["Done", "Error", "None", "1"]),
    correctAnswer: "Error",
    explanation: "The built-in `eval()` function in Python strictly only accepts expressions (which evaluate to a value). An assignment like `x = 1` is a STATEMENT, not an expression. Passing a statement to `eval()` immediately triggers a `SyntaxError`. (You must use `exec()` for statements)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code?\n```python\nd = dict.fromkeys([1, 2], [])\nd[1].append(3)\nprint(d[2])\n```",
    options: JSON.stringify(["[]", "[3]", "Error", "None"]),
    correctAnswer: "[3]",
    explanation: "This is a dangerous trap with `dict.fromkeys()`. It evaluates the default value `[]` exactly ONCE and assigns that EXACT SAME list reference to every single key. Modifying the list via `d[1]` mutates the shared list, so `d[2]` also reflects the `[3]`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Python",
    prompt: "What is the output of the following Python code (Python 3.8+)?\n```python\ndef func(a, /, b):\n    return a + b\n\ntry:\n    func(a=1, b=2)\n    print(\"Done\")\nexcept TypeError:\n    print(\"Error\")\n```",
    options: JSON.stringify(["Done", "Error", "3", "None"]),
    correctAnswer: "Error",
    explanation: "Python 3.8 introduced Positional-Only Parameters using the forward slash `/`. Any arguments defined BEFORE the `/` (like `a`) strictly CANNOT be passed as keyword arguments. Calling `func(a=1, ...)` violates this rule, throwing a `TypeError`."
  },
  // C++
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint x = 1;\nint main() {\n    int x = 2;\n    std::cout << ::x;\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "2", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "1",
    explanation: "When a local variable shadows a global variable of the same name, you can still explicitly access the global variable by using the unary Scope Resolution Operator `::` (with no namespace before it). Thus, `::x` correctly accesses the global `1`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Empty {};\nint main() {\n    std::cout << (sizeof(Empty) == 0);\n    return 0;\n}\n```",
    options: JSON.stringify(["0", "1", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "0",
    explanation: "In C++, the size of an empty class or struct is NEVER zero. The standard strictly guarantees that every distinct object must have a unique memory address, which forces compilers to insert at least 1 dummy byte into empty classes. Thus, `sizeof(Empty) == 0` is false (0)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    const int a = 5;\n    int* p = const_cast<int*>(&a);\n    *p = 10;\n    std::cout << \"Done\";\n    return 0;\n}\n```",
    options: JSON.stringify(["Done", "Compiler Error", "Garbage", "Undefined Behavior"]),
    correctAnswer: "Undefined Behavior",
    explanation: "While `const_cast` legally allows you to strip away the `const` qualifier to obtain a mutable pointer, actually using that pointer to MODIFY a variable that was originally declared as `const` invokes strict Undefined Behavior. It might print 'Done', crash, or ignore the write entirely."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    char a = 1, b = 2;\n    auto c = a + b;\n    std::cout << (sizeof(c) == 1);\n    return 0;\n}\n```",
    options: JSON.stringify(["1", "0", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "0",
    explanation: "This highlights C++ Integer Promotion rules. When performing arithmetic operations on types smaller than `int` (like `char` or `short`), the operands are implicitly promoted to `int` BEFORE the addition. Thus, `c` becomes an `int` (usually 4 bytes), making `sizeof(c) == 1` false (0)."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass Base {\npublic:\n    virtual ~Base() = 0;\n};\nBase::~Base() {}\nint main() {\n    std::cout << \"Done\";\n    return 0;\n}\n```",
    options: JSON.stringify(["Done", "Compiler Error", "Linker Error", "Undefined Behavior"]),
    correctAnswer: "Done",
    explanation: "In C++, you CAN declare a pure virtual destructor (`= 0`) to make a class abstract without needing dummy methods. However, you MUST STILL provide a function body implementation for it (`Base::~Base() {}`), because derived class destructors always call the base destructor. Without the body, it would cause a Linker Error. With it, it compiles and prints 'Done'."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nclass A {\npublic:\n    ~A() { throw 1; }\n};\nint main() {\n    try {\n        A obj;\n        throw 2;\n    } catch (...) {\n        std::cout << \"Caught\";\n    }\n    return 0;\n}\n```",
    options: JSON.stringify(["Caught", "Runtime Crash", "Compiler Error", "Undefined Behavior"]),
    correctAnswer: "Runtime Crash (std::terminate)",
    explanation: "If a destructor throws an exception while the stack is ALREADY unwinding from another active exception (in this case, `throw 2`), the C++ runtime immediately aborts the program by calling `std::terminate()`. Exceptions must never escape a destructor during unwinding."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "C++",
    prompt: "What is the output of the following C++ code?\n```cpp\n#include <iostream>\nint main() {\n    std::cout << \"Hi\" << std::endl;\n    return 0;\n}\n```",
    options: JSON.stringify(["Hi", "Compiler Error", "Hi\\n", "Undefined Behavior"]),
    correctAnswer: "Hi\\n",
    explanation: "The `std::endl` manipulator does two distinct things: it outputs a newline character (`\\n`), and it actively forces a flush of the underlying output stream buffer to the OS. (Note: Excessive use of `std::endl` in loops is a major performance bottleneck compared to just `\\n`)."
  },
  // Java
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            System.exit(0);\n        } finally {\n            System.out.print(\"Finally\");\n        }\n    }\n}\n```",
    options: JSON.stringify(["Finally", "No Output", "Compile Error", "Runtime Error"]),
    correctAnswer: "No Output",
    explanation: "While `finally` blocks are virtually guaranteed to run (even after returns or exceptions), calling `System.exit(0)` violently terminates the entire JVM instance immediately. The OS reclaims the process before the `finally` block ever has a chance to execute."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass P { static void f() { System.out.print(\"P\"); } }\nclass C extends P { static void f() { System.out.print(\"C\"); } }\npublic class Main {\n    public static void main(String[] args) {\n        P obj = new C();\n        obj.f();\n    }\n}\n```",
    options: JSON.stringify(["C", "P", "Compile Error", "Runtime Error"]),
    correctAnswer: "P",
    explanation: "Static methods in Java are NOT polymorphic; they cannot be overridden, only \"hidden\". Because method resolution for static methods is evaluated strictly at compile-time based on the REFERENCE type (`P`), the compiler hardcodes a call to `P.f()`, completely ignoring the `C` runtime object."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        String s = \"A\";\n        s.concat(\"B\");\n        System.out.print(s);\n    }\n}\n```",
    options: JSON.stringify(["AB", "A", "Compile Error", "Runtime Error"]),
    correctAnswer: "A",
    explanation: "Strings in Java are completely immutable. The `concat()` method does NOT modify the original string in memory; instead, it generates and returns an entirely new String object (`\"AB\"`). Because the return value is ignored and not assigned back to `s`, `s` remains strictly `\"A\"`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.util.ArrayList;\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Integer> l = new ArrayList<Integer>() {{ add(1); }};\n        System.out.print(l.getClass().getName().contains(\"Main$\"));\n    }\n}\n```",
    options: JSON.stringify(["true", "false", "Compile Error", "Runtime Error"]),
    correctAnswer: "true",
    explanation: "This exposes the dangerous 'Double Brace Initialization' anti-pattern. The first set of braces `{}` dynamically subclasses `ArrayList` into a brand new Anonymous Inner Class. The second `{}` is an instance initialization block. Thus, the class name actually belongs to an anonymous subclass attached to `Main`."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\npublic class Main {\n    public static void main(String[] args) {\n        short s = 1;\n        s += 1;\n        System.out.print(s);\n    }\n}\n```",
    options: JSON.stringify(["2", "Compile Error", "Runtime Error", "No Output"]),
    correctAnswer: "2",
    explanation: "Standard arithmetic `s = s + 1` causes a compile error because `1` is an `int`, promoting the result to `int` (which requires an explicit cast back to `short`). However, compound assignment operators like `+=` automatically inject a hidden explicit narrowing cast `s = (short)(s + 1)`, compiling and working perfectly."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nimport java.io.IOException;\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            throw new IOException();\n        } catch (IOException | RuntimeException e) {\n            e = new RuntimeException();\n        }\n    }\n}\n```",
    options: JSON.stringify(["Compile Error", "Runs Successfully", "Runtime Error", "No Output"]),
    correctAnswer: "Compile Error",
    explanation: "In Java 7's multi-catch block feature (`catch (A | B e)`), the exception variable `e` is implicitly forced to be `final` by the compiler. Attempting to forcefully reassign `e` to a new object inside the catch block results in a hard compilation error."
  },
  {
    type: QuestionType.GUESS_OUTPUT,
    category: "Coding",
    subTopic: "Java",
    prompt: "What is the output of the following Java code?\n```java\nclass Base { Base() { System.out.print(\"B\"); } }\nclass Derived extends Base {\n    Derived() {\n        System.out.print(\"D\");\n        super();\n    }\n}\npublic class Main {\n    public static void main(String[] args) { new Derived(); }\n}\n```",
    options: JSON.stringify(["BD", "DB", "Compile Error", "Runtime Error"]),
    correctAnswer: "Compile Error",
    explanation: "When explicitly calling a parent constructor using `super()`, Java enforces a strict rule: it MUST absolutely be the very first statement inside the child constructor. Placing it after `System.out.print(\"D\")` causes an immediate compilation error."
  }
];

async function main() {
  console.log("Seeding GUESS_OUTPUT questions...");
  for (const q of guessQuestions) {
    await prisma.question.create({
      data: q
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
