export interface TableParams {

    pageSize: number;
    pageNumber: number;
    startDate?: Date;
    endDate?: Date;
    sortField?: string;
    order: 'ASC' | 'DESC';
    filters?: {
        [key: string]: any[] | any;
    };
    keywords?: string;

}