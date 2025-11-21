import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { storageType } from "src/common/enums";

@Injectable()
export class S3Service{
    private readonly s3Client:S3Client
    constructor() {
        this.s3Client= new S3Client({
        region:process.env.AWS_REGION!,
        credentials:{
             accessKeyId:process.env.ACCESSkEY_AWS!,
            secretAccessKey:process.env.SECRETACCESSkEY_AWS!
        }
    })
    }
 uploadFile=async({
    storetype=storageType.cloud,
    Bucket=process.env.AWS_BUCKETNAME!,
    path="genreal",
    ACL="private" as ObjectCannedACL,
    file
}:{
path:string
Bucket?:string
ACL?:ObjectCannedACL,
storetype?:storageType,
file:Express.Multer.File
}
):Promise<string>=>{
const commend= new PutObjectCommand({
    Bucket,
    ACL,
    Key:`${process.env.APLICATION_NAME!}/${path}/${randomUUID()}_${file.originalname}`,
    Body:storetype===storageType.cloud ? file.buffer : createReadStream(file.path),
    ContentType:file.mimetype
})
await this.s3Client.send(commend)
if(!commend.input.Key){
    throw new BadRequestException("failed to upload file s3")
}
return commend.input.Key
}

UploadLargeFile=async({
    storetype=storageType.cloud,
    Bucket=process.env.AWS_BUCKETNAME!,
    path="genreal",
    ACL="private" as ObjectCannedACL,
    file
}:{
path:string
Bucket?:string
ACL?:ObjectCannedACL,
storetype?:storageType,
file:Express.Multer.File
})=>{
    const upload=new Upload({
        client:this.s3Client,
    params:{
         Bucket,
    ACL,
    Key:`${process.env.APLICATION_NAME!}/${path}/${randomUUID()}_${file.originalname}`,
    Body:storetype===storageType.cloud ? file.buffer : createReadStream(file.path),
    ContentType:file.mimetype
    }
    })
   const {Key}= await upload.done()!
   if(!Key){
 throw new BadRequestException("failed to upload file s3")
   }
   return Key
}

 UploadFiles=async({
    storetype=storageType.cloud,
    Bucket=process.env.AWS_BUCKETNAME!,
    path="genreal",
    ACL="private" as ObjectCannedACL,
    files,
    LargeFile=false
}:{
path:string
Bucket?:string
ACL?:ObjectCannedACL,
storetype?:storageType,
files:Express.Multer.File[]
LargeFile?:Boolean
})=>{
let urls:string[]=[]
if(LargeFile==true){
urls=await Promise.all(files.map(file=>this.UploadLargeFile({Bucket,ACL,path,file})))
}else{
urls=await Promise.all(files.map(file=>this.uploadFile({Bucket,ACL,path,file})))
}
return urls

}
createUrlRequestPresigner=async({
    Bucket=process.env.AWS_BUCKETNAME!,
    path="genreal",
    ContentType,
    originalname
}:{
path?:string
Bucket?:string
ContentType:string,
originalname:string
})=>{


    const command=new PutObjectCommand({
        Bucket,
        Key:`${process.env.APLICATION_NAME!}/${path}/${randomUUID()}_${originalname}`,
        ContentType
    })
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 });
    return url


}
 Get_File=async({
    Bucket=process.env.AWS_BUCKETNAME!,
    Key
}:{
Key:string
Bucket?:string
})=>{


    const command=new GetObjectCommand({
        Bucket,
        Key
    })   
    return await this.s3Client.send(command)
}
getUrlRequestPresigner=async({
    Bucket=process.env.AWS_BUCKETNAME!,
    Key,
    downloadName
}:{
Key:string
Bucket?:string
downloadName:string | undefined

})=>{


    const command=new PutObjectCommand({
        Bucket,
        Key,
        ContentDisposition: downloadName?`attachment; filename="${downloadName}"`:undefined
    })
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 });
    return url


}
deleteFile=async({
    Bucket=process.env.AWS_BUCKETNAME!,
    Key,
}:{
Key:string
Bucket?:string
})=>{

 const command =new DeleteObjectCommand({
        Bucket,
        Key
    })
    return await this.s3Client.send(command)
}
 deleteFiles=async({
    Bucket=process.env.AWS_BUCKETNAME!,
    urls,
    Quiet=false
}:{
urls:string[]
Bucket?:string
Quiet?:boolean
})=>{
 if (!urls || urls.length === 0) return;
 const command =new DeleteObjectsCommand({
      Bucket,
        Delete:{
            Objects: urls.map(url=>({Key:url})),
            Quiet
        },
        
    })
    return await this.s3Client.send(command)
}

 ListFile=async({
    Bucket=process.env.AWS_BUCKETNAME!,
    path,

}:{
path:string
Bucket?:string
})=>{

 const command =new ListObjectsV2Command({
      Bucket,
       Prefix:`${process.env.APLICATION_NAME}/${path}`
        
    })
    return await this.s3Client.send(command)
}
}