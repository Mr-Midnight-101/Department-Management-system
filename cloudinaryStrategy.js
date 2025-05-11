/*

! cloudinary is platform to upload a file. 
? We will be using multer for file uploading in cloudinary.We can use express.fileUpload as well but nowdays multer is first choice of developers
* first upload the file to local storage
* then storage file upload to cloudinary and get url of file 
* then unlink the file from local storage
* required:
? cloudinary to upload file in cloud
? multer to perform uploading in url retrival
? fs: filepath to local storage and after upload unlink the file
*/