// A reveal's heading from its log line: "Kagemimi: Dorini's hand is A, B." -> "Kagemimi: Dorini's hand".
export const peekTitle = (text: string) => text.replace(/\s(?:is|are)\s.*$/, '');
