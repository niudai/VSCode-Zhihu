export interface IImageUploadToken {
    upload_token: {
        access_key: string,
        access_token: string,
        access_timestamp: number,
        access_id: string
    },
    upload_file: {
        image_id: string,
        state: number,
        object_key: string // file name
    }
}