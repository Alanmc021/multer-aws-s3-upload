// const { S3 } = require("aws-sdk");
// const { S3Client, PutObjectCommand, } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

//sigle upload image
exports.s3Uploadv1 = async (data) => {
  let nameImage = `uploads/${uuid()}-${data.file.originalname}`
  
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: nameImage,
    Body: data.file.buffer
  }

  s3.putObject(uploadParams, function (err, data) {
    if (err) {
      console.log("Erro ao fazer upload da imagem: ", err);    
    } else {
      console.log("Imagem enviada com sucesso!");      
    }
  });
  
  return  getUrlS3(nameImage)
}

function getUrlS3(name) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: name,
    Expires: 60 * 5 // tempo de expiração em segundos
  };
  const url = s3.getSignedUrl('getObject', params);
  console.log(url);
  return url
}

//multiple image upload
exports.s3Uploadv2 = async (files) => {
  const s3 = new S3();
  const params = files.map((file) => {
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file.originalname}`,
      Body: file.buffer,
    };
  });
  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};
//multiple image upload

//multiple image upload
exports.s3Uploadv3 = async (files) => {
  const s3client = new S3Client();

  const params = files.map((file) => {
    getUrl(file.originalname)
    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${uuid()}-${file.originalname}`,
      Body: file.buffer,
    };
  }); 

  return await Promise.all(
    params.map((param) => s3client.send(new PutObjectCommand(param)))
  );
};
//multiple image upload


 