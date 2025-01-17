import request from "@/utils/request";


//------------------------------文件上传接口------------------------------
//文件上传接口,任务执行前需要上传文件返回文件地址
// CREATOR和ADMIN角色可以上传文件
export const uploadFileService = (file) => {
    try {
        const token = localStorage.getItem('token');

        // 创建 FormData 对象  
        const formData = new FormData();
        formData.append('file', file);

        const response = request.post('/file/upload', formData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'multipart/form-data'
            },
        });
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
