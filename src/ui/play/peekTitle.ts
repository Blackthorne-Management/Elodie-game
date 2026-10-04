// A reveal's heading from its log line: "Shadow's Ear: Dorini's hand is A, B." -> "Shadow's Ear: Dorini's hand".
export const peekTitle = (text: string) => text.replace(/\s(?:is|are)\s.*$/, '');
