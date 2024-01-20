export interface Chapterfilter {
    subject_id?: string,
    board_id?: string,
    syllabus_id?: string,
    class_id?: string,
    searchValue?: string,
    'repository.id'?: string | null,
    filterKeysArray: [
        "name"
    ],
    page: number,
    limit: number
}
