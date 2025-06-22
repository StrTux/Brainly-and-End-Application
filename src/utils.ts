export function random(len: number): string {
    const characters = "qertyloadsfh94954";
    const charactersLength = characters.length;
    let result = "";

    for (let i = 0; i < len; i++) {
        result += characters[Math.floor(Math.random() * charactersLength)];
    }

    return result;
}
