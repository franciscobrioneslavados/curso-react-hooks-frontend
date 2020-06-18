export const createKeyword = text => {
    const arrayKeyword = [];

    const arrayCleanWords = text.match(/("[^"]+"|[^"\s]+)/g);

    arrayCleanWords.forEach(word => {
        let resumeWord = '';
        word.split('').forEach(char => {
            resumeWord += char;
            arrayKeyword.push(resumeWord.toLowerCase());
        });
    });

    let resumeChar = '';
    text.split("").forEach(char => {
        resumeChar += char;
        arrayKeyword.push(resumeChar);
    })

    return arrayKeyword;

}