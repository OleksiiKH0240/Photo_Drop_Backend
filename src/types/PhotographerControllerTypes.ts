export type createAlbumInputType = {
    albumName: string,
    albumLocation: string,
    clientsIds: number[]
};

export type addClientsToPhotosType = {
    clientsIds: number[],
    photosIds: number[]
};

export type authInputType = {
    username: string,
    password: string,
    email?: string,
    fullname?: string
};
