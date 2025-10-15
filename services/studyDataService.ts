import { StudyData, Language } from '../types';

/**
 * Loads the complete study guide from the local JSON file.
 * This function uses fetch for broad browser compatibility.
 * 
 * @param language The desired language for the session.
 * @returns A promise that resolves to the full study data.
 */
export const getStudyGuide = async (language: Language): Promise<StudyData> => {
    // Simulate a short delay to allow the loading spinner to be visible
    // for a better user experience, preventing an instantaneous flash.
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await fetch('./data/study-data.json');
    if (!response.ok) {
        throw new Error('Failed to fetch study data');
    }
    const allStudyData = await response.json();

    // The JSON file contains all data. We just need to set the language preference
    // in the lecture object for context within the app.
    const studyDataWithLang = {
        ...allStudyData,
        lecture: {
            ...allStudyData.lecture,
            language: language,
        }
    };

    return studyDataWithLang as StudyData;
};
