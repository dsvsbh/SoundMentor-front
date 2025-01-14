import request from "@/utils/request";


//------------------------------文件上传接口------------------------------
//文件上传接口,任务执行前需要上传文件返回文件地址
// CREATOR和ADMIN角色可以上传文件
export const uploadFileService = (file) => {
    try {
        const token = localStorage.getItem('token');
        const response = request.post('/file/upload', file, {
            headers: { Authorization: token },
        });
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
