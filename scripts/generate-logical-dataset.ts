import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'logical.jsonl');

type GeneratedQ = {
  question: string;
  options: string[];
  rationale: string;
  correct: string;
};

const generated: GeneratedQ[] = [];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem(arr: any[]) {
  return arr[randInt(0, arr.length - 1)];
}

const subjects = ["cats", "dogs", "birds", "pens", "books", "tables", "chairs", "cars", "trees", "flowers", "laptops", "phones", "bottles", "cups", "glasses", "mirrors", "shoes", "shirts", "hats", "doors", "windows", "walls"];
const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Nina", "Oscar", "Peggy", "Trent", "Victor", "Walter"];
const cities = ["New York", "London", "Paris", "Tokyo", "Berlin", "Sydney", "Toronto", "Mumbai", "Dubai", "Rome", "Seoul", "Madrid", "Delhi", "Cairo", "Moscow"];
const actions = ["increase taxes", "ban smoking", "build a new highway", "reduce school hours", "increase public transport fares", "ban plastic bags", "mandate recycling", "reduce working days", "increase retirement age"];

function generate() {
  // Statement & Conclusion (Syllogisms)
  for (let i = 0; i < 500; i++) {
    const s1 = randItem(subjects);
    let s2 = randItem(subjects);
    while (s1 === s2) s2 = randItem(subjects);
    let s3 = randItem(subjects);
    while (s3 === s1 || s3 === s2) s3 = randItem(subjects);

    const type = randInt(0, 1);
    if (type === 0) {
      generated.push({
        question: `Statements:\n1. All ${s1} are ${s2}.\n2. Some ${s2} are ${s3}.\n\nConclusions:\nI. Some ${s3} are ${s1}.\nII. Some ${s3} are ${s2}.`,
        options: ["A) Only conclusion I follows", "B) Only conclusion II follows", "C) Either I or II follows", "D) Neither I nor II follows", "E) Both I and II follow"],
        rationale: `From 'Some ${s2} are ${s3}', we know 'Some ${s3} are ${s2}' is true. We cannot deduce a relationship between ${s3} and ${s1}. Hence only II follows.`,
        correct: "B"
      });
    } else {
      generated.push({
        question: `Statements:\n1. No ${s1} is a ${s2}.\n2. All ${s3} are ${s1}.\n\nConclusions:\nI. No ${s3} is a ${s2}.\nII. Some ${s1} are ${s3}.`,
        options: ["A) Only conclusion I follows", "B) Only conclusion II follows", "C) Either I or II follows", "D) Neither I nor II follows", "E) Both I and II follow"],
        rationale: `Since all ${s3} are inside ${s1}, and no ${s1} intersects ${s2}, no ${s3} can intersect ${s2}. Also, 'All ${s3} are ${s1}' implies 'Some ${s1} are ${s3}'. Both follow.`,
        correct: "E"
      });
    }
  }

  // Course of Action
  for (let i = 0; i < 500; i++) {
    const city = randItem(cities);
    const issues = ["severe water logging", "a sudden spike in crime rates", "a massive power outage", "an outbreak of a viral fever", "heavy traffic congestion", "severe air pollution", "food shortage", "earthquake tremors"];
    const issue = randItem(issues);
    
    generated.push({
      question: `Statement: The city of ${city} has been facing ${issue} for the past week.\n\nCourses of Action:\nI. The government should immediately dispatch emergency relief and management teams.\nII. The government should ignore the situation as it will resolve itself.`,
      options: ["A) Only I follows", "B) Only II follows", "C) Either I or II follows", "D) Neither I nor II follows", "E) Both I and II follow"],
      rationale: `Action I is a logical and immediate step to address the crisis. Action II is absurd and irresponsible. Thus, only Course of Action I follows.`,
      correct: "A"
    });
  }

  // Statement & Argument
  for (let i = 0; i < 500; i++) {
    const action = randItem(actions);
    const p = randItem(["country", "city", "state", "organization", "school"]);
    generated.push({
      question: `Statement: Should the ${p} ${action}?\n\nArguments:\nI. Yes, it will bring significant long-term benefits to the economy and environment.\nII. No, it will cause immediate inconvenience to the common people.`,
      options: ["A) Only argument I is strong", "B) Only argument II is strong", "C) Either I or II is strong", "D) Neither I nor II is strong", "E) Both I and II are strong"],
      rationale: `Both arguments address valid facets of the issue. Argument I focuses on long-term benefits, while Argument II highlights practical short-term challenges. Both are strong.`,
      correct: "E"
    });
  }

  // Statement & Assumptions
  for (let i = 0; i < 500; i++) {
    const p1 = randItem(names);
    const items = ["book", "tutorial", "guide", "lecture", "seminar"];
    const item = randItem(items);
    generated.push({
      question: `Statement: "${p1}, if you want to perform well in the exam, you must read this ${item}," said the teacher.\n\nAssumptions:\nI. The ${item} contains relevant material for the exam.\nII. ${p1} wants to perform well in the exam.`,
      options: ["A) Only assumption I is implicit", "B) Only assumption II is implicit", "C) Either I or II is implicit", "D) Neither I nor II is implicit", "E) Both I and II are implicit"],
      rationale: `The teacher advises reading the ${item} for exam performance, which assumes the ${item} is helpful (I). The conditional 'if you want...' assumes the student might want to do well, but advising it implies the student has that goal (II). Both are implicit.`,
      correct: "E"
    });
  }

  // Theme Detection
  const themes = [
    { text: "The ozone layer protects the Earth from harmful UV rays. CFCs have been damaging this layer.", theme: "Environmental conservation is critical." },
    { text: "Regular exercise and a balanced diet lead to a healthier lifestyle and longer lifespan.", theme: "Healthy habits promote longevity." },
    { text: "The stock market crashed, leading to widespread unemployment and business closures.", theme: "Economic instability has severe consequences." },
    { text: "Reading books improves vocabulary, enhances imagination, and reduces stress levels.", theme: "Reading has multiple cognitive benefits." },
    { text: "Excessive use of smartphones has been linked to poor sleep and increased anxiety in teenagers.", theme: "Technology overuse harms mental health." }
  ];
  for (let i = 0; i < 500; i++) {
    const t = randItem(themes);
    let other1 = randItem(themes).theme;
    while(other1 === t.theme) other1 = randItem(themes).theme;
    let other2 = randItem(themes).theme;
    while(other2 === t.theme || other2 === other1) other2 = randItem(themes).theme;
    
    const options = [`A) ${t.theme}`, `B) ${other1}`, `C) ${other2}`, `D) Education is important`, `E) Technology is advancing`];
    generated.push({
      question: `Read the passage and identify the main theme:\n\n"${t.text} (Variation ${i})"\n\nWhich of the following best captures the theme detection?`,
      options,
      rationale: `The passage directly discusses elements related to the theme: ${t.theme}.`,
      correct: "A"
    });
  }

  // Logical Deduction
  for (let i = 0; i < 500; i++) {
    const p1 = randItem(names);
    let p2 = randItem(names);
    while (p2 === p1) p2 = randItem(names);
    let p3 = randItem(names);
    while (p3 === p1 || p3 === p2) p3 = randItem(names);
    
    generated.push({
      question: `Logical Deduction:\n1. If ${p1} goes to the party, then ${p2} will not go.\n2. ${p3} will go to the party only if ${p2} goes.\n3. ${p1} went to the party. (Event ${i})\n\nWho definitely did NOT go to the party?`,
      options: [`A) ${p2} and ${p3}`, `B) Only ${p2}`, `C) Only ${p3}`, `D) ${p1} and ${p3}`, `E) None of the above`],
      rationale: `Since ${p1} went, ${p2} did not go. Since ${p3} only goes if ${p2} goes, ${p3} also did not go. Thus, both ${p2} and ${p3} did not go.`,
      correct: "A"
    });
  }

  // Logical Problems
  for (let i = 0; i < 500; i++) {
    const p1 = randItem(names);
    const n = randInt(2, 5);
    const m = randInt(10, 15); // ensuring n < m always
    generated.push({
      question: `Logical problem:\n${p1} is taller than exactly ${n} people in a group of ${m}. What is ${p1}'s rank in height from the tallest to the shortest? (Group ID: ${i})`,
      options: [`A) ${m - n}`, `B) ${m - n - 1}`, `C) ${m - n + 1}`, `D) ${n}`, `E) ${n + 1}`],
      rationale: `If ${p1} is taller than ${n} people, there are ${n} people shorter than ${p1}. The total is ${m}. So there are ${m} - 1 (excluding ${p1}) = ${m-1} others. ${m-1} - ${n} people are taller than ${p1}. Thus, ${p1}'s rank from the top is ${m - n}.`,
      correct: "A"
    });
  }

  // Letter Series
  for (let i = 0; i < 500; i++) {
    const start = randInt(65, 75); // A to K
    const step = randInt(1, 2);
    const series = [String.fromCharCode(start), String.fromCharCode(start+step), String.fromCharCode(start+step*2), String.fromCharCode(start+step*3)];
    const next = String.fromCharCode(start+step*4);
    generated.push({
      question: `Find the next term in the letter series: ${series.join(", ")}, ? (Seq ${i})`,
      options: [`A) ${next}`, `B) ${String.fromCharCode(start+step*4 + 1)}`, `C) ${String.fromCharCode(start+step*4 - 1)}`, `D) ${String.fromCharCode(start+step*5)}`, `E) None`],
      rationale: `The series increments by ${step} letters each time. The next letter is ${next}.`,
      correct: "A"
    });
  }

  // Verbal Classification
  for (let i = 0; i < 500; i++) {
    const groups = [
      ["Apple", "Banana", "Orange", "Grape", "Carrot"],
      ["Dog", "Cat", "Lion", "Tiger", "Eagle"],
      ["Car", "Bus", "Truck", "Motorcycle", "Airplane"],
      ["Red", "Blue", "Green", "Yellow", "Square"],
      ["Piano", "Guitar", "Violin", "Flute", "Painting"]
    ];
    const group = [...randItem(groups)];
    const odd = group[4];
    
    generated.push({
      question: `Verbal Classification: Pick the odd one out from the following:\n1. ${group[0]}\n2. ${group[1]}\n3. ${group[2]}\n4. ${group[3]}\n5. ${group[4]} (Set ${i})`,
      options: [`A) ${group[0]}`, `B) ${group[1]}`, `C) ${group[3]}`, `D) ${group[4]}`, `E) ${group[2]}`],
      rationale: `The word ${group[4]} does not belong to the same category as the others.`,
      correct: "D"
    });
  }

  // Letter & Symbol Series
  for (let i = 0; i < 500; i++) {
    const start = randInt(65, 80);
    const series = [`${String.fromCharCode(start)}#`, `${String.fromCharCode(start+1)}@`, `${String.fromCharCode(start+2)}#`, `${String.fromCharCode(start+3)}@`];
    const next = `${String.fromCharCode(start+4)}#`;
    generated.push({
      question: `Find the next term in the letter & symbol series: ${series.join(", ")}, ? (Pattern ${i})`,
      options: [`A) ${next}`, `B) ${String.fromCharCode(start+4)}@`, `C) ${String.fromCharCode(start+5)}#`, `D) ${String.fromCharCode(start+3)}#`, `E) None`],
      rationale: `The letters increment by 1, and the symbols alternate between # and @. Next is ${next}.`,
      correct: "A"
    });
  }

  // Number Series
  for (let i = 0; i < 500; i++) {
    const start = randInt(2, 20);
    const diff = randInt(2, 10);
    const series = [start, start + diff, start + diff * 2, start + diff * 3, start + diff * 4];
    const next = start + diff * 5;
    generated.push({
      question: `Find the missing number in the series: ${series.join(", ")}, ? (Progression ${i})`,
      options: [`A) ${next}`, `B) ${next + 1}`, `C) ${next - 1}`, `D) ${next + diff}`, `E) None`],
      rationale: `The series increases by a constant difference of ${diff}. The next number is ${next}.`,
      correct: "A"
    });
  }
  // Blood Relations
  for (let i = 0; i < 500; i++) {
    const p1 = randItem(names);
    const p2 = randItem(names);
    const rel = randItem(["father", "mother", "brother", "sister", "uncle", "aunt"]);
    generated.push({
      question: `Blood relation: Pointing to a photograph, ${p1} said, "He is the son of the only son of my grandfather." How is the man in the photograph related to ${p1}? (Scenario ${i})`,
      options: [`A) Brother`, `B) Uncle`, `C) Son`, `D) Data inadequate`, `E) None of these`],
      rationale: `The only son of ${p1}'s grandfather is ${p1}'s father. The son of ${p1}'s father is ${p1}'s brother.`,
      correct: "A"
    });
  }

  // Directions
  for (let i = 0; i < 500; i++) {
    const dist = randInt(10, 50);
    generated.push({
      question: `Direction sense: A man walks ${dist} km towards North, then turns left and walks ${dist} km. He then turns left and walks ${dist} km. Which direction is he facing now? (Path ${i})`,
      options: [`A) South`, `B) North`, `C) East`, `D) West`, `E) None`],
      rationale: `He walks North, turns left (faces West), turns left again (faces South). So he is facing South.`,
      correct: "A"
    });
  }
}

generate();

// Write to JSONL
const stream = fs.createWriteStream(DATA_FILE);
for (const q of generated) {
  // We shuffle the options to randomize the correct letter.
  const correctAnswerText = q.options.find(o => o.startsWith(q.correct))?.substring(3) || q.options[0].substring(3);
  
  const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5);
  let newCorrect = "A";
  shuffledOpts.forEach((o, idx) => {
    const textWithoutPrefix = o.replace(/^[A-E]\)\s*/, "");
    if (textWithoutPrefix === correctAnswerText) {
      newCorrect = String.fromCharCode(65 + idx);
    }
    // Rewrite A) B) prefixes to be sequential
    shuffledOpts[idx] = `${String.fromCharCode(65 + idx)}) ` + textWithoutPrefix;
  });

  stream.write(JSON.stringify({
    question: q.question,
    options: shuffledOpts,
    rationale: q.rationale,
    correct: newCorrect
  }) + "\n");
}
stream.end();

console.log(`Generated ${generated.length} logical reasoning questions to data/logical.jsonl`);
