import request from '@/utils/request.js'


//--------------- 组织相关接口 ---------------


// 获取组织列表
export const getOrganizationListService = async (role) => {
    try {
        var params = new URLSearchParams();
        params.append('role', role);
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found in localStorage');
        }
        const response = await request.get('/organization/list', {
            headers: { Authorization: token },
            params: params
        });
        if (response.code == 0) {
            return response.data;
        } else {
            throw new Error(`HTTP error! status: ${response.code}`);
        }
    } catch (error) {
        console.error('Error fetching organization list:', error);
        throw error;
    }
};

// 查询组织成员列表
export const getOrganizationMemberListService = async (organizationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await request.get(`/organization/userList/${organizationId}`, {
            headers: { Authorization: token },
        });
        if (response.code == 0) {
            return response.data;
        } else {
            throw new Error(`HTTP error! status: ${response.code}`);
        }
    } catch (error) {
        console.error('Error fetching organization member list:', error);
        throw error;
    }
}

// 获取组织分享码
export const getOrganizationShareCodeService = async (organizationId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('请登录！');
        }
        const response = await request.get(`/organization/shareCode/${organizationId}`, {
            headers: { Authorization: token },
        });
        if (response.code == 0) {
            return response.data;
        } else {
            throw new Error(`Error response from server: ${response.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error fetching organization share code:', error);
        throw error;
    }
};

// 用户创建组织
export const createOrganizationService = (organizationData) => {
    try {
        console.log(JSON.stringify(organizationData));
        const token = localStorage.getItem('token');
        const response = request.post('/organization/create', JSON.stringify(organizationData), {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
        });
        return response;
    } catch (error) {
        console.error('Error creating organization:', error);
        throw error;
    }
}

// 用户通过分享码加入组织
export const joinOrganizationService = async (data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await request.post('/organization/join', JSON.stringify(data), {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error('Error joining organization:', error);
        throw error;
    }
};

//  更新组织内的用户角色
// 只能修改ADMIN和USER角色，不能修改CREATOR角色,只有CREATOR角色可以修改其他用户角色
export const updateUserRoleService = async (data) => {
    let response;
    try {
        const token = localStorage.getItem('token');
        console.log("提交的表单----", data);
        response = await request.put('/organization/updateRole', JSON.stringify(data), {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
        });

        if (response.code === "0") {
            return response;
        } else {
            throw new Error(`更新用户角色失败，状态码: ${response.code}`);
        }

    } catch (error) {
        console.error('出错了：', error.message);
        throw error;
    }
}

// 将用户踢出组织
// 只有CREATOR角色可以踢出用户
export const kickUserService = async (data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await request.delete('/organization/remove', {
            headers: { Authorization: token },
            data: data
        });

        if (response.code != 0) {
            throw new Error(`删除用户失败，状态码: ${response.code}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error kicking user:', error);
        throw error;
    }
}

// 解散组织
// 只有CREATOR角色可以解散组织
export const deleteOrganizationService = async (organizationId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await request.delete(`/organization/remove/${organizationId}`, {
            headers: { Authorization: token },
        });
        if (response.code != 0) {
            throw new Error(`删除组织失败，状态码: ${response.code}`);
        }
        return response;
    } catch (error) {
        console.error('Error deleting organization:', error);
        throw error;
    }
}

// 查询组织文件列表（分页，动态条件）
export const getGroupFiles = async (formData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await request.post('/organization/fileList', formData, {
            headers: { Authorization: token },
        });
        if (response.code != "0") {
            console.log("获取失败：", response.message);
        }
        return response;
    } catch (error) {
        console.error("获取失败：", error.message);
        throw error;
    }
}

// 分享用户文件到组织
export const uploadFileToGroup = async (form) => {
    try {
        const token = localStorage.getItem('token');
        const res = await request.post('/organization/shareFile', form, {
            headers: { Authorization: token },
        });
        if (res.code === "0") {
            console.log("上传成功");
        }
        return res;

    } catch (err) {
        console.error("上传出错:", err.message);
    }
}

// 用户下载文件时增加下载次数接口
export const getDownloadCounts = async (body) => {
    try {
        const token = localStorage.getItem('token');
        const res = await request.put('/organization/download', body, {
            headers: { Authorization: token },
        });
        if (res.code === "0") {
            console.log("更新下载次数成功！")
        }
        return res;
    } catch (err) {
        console.error("更新出错！", err.message);
    }
}