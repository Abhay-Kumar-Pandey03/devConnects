const { isSimilarSkill } = require("./semanticMatch");

const calculateMatchScore = async (mySkills = [], theirSkills = []) => {

    if (!mySkills.length || !theirSkills.length) return 55;

    let matchScore = 55;

    const normalizedMine = mySkills.map(s => s.toLowerCase().trim());
    const normalizedTheirs = theirSkills.map(s => s.toLowerCase().trim());

    let matchCount = 0;

    // Compare each skill smartly
    for (let skillA of normalizedMine) {
        for (let skillB of normalizedTheirs) {

            const isMatch = await isSimilarSkill(skillA, skillB);

            if (isMatch) {
                matchCount++;
                break;
            }
        }
    }

    if (matchCount > 0) {
        const overlapRatio =
            matchCount / Math.min(normalizedMine.length, normalizedTheirs.length);

        matchScore = 50 + Math.round(overlapRatio * 50);
    } else {
        matchScore = 45;
    }

    return Math.min(100, matchScore);
};

module.exports = { calculateMatchScore };