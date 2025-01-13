// 导入请求工具
import request from '@/utils/request.js'
import axios from 'axios'

//                        免登接口

// 注册
export const userRegisterService = (registerData) => {
    const registerRes = request.post('/openApi/user/addUser', JSON.stringify(registerData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return registerRes;
}

// 登录
export const userLoginService = async (loginData) => {
    const loginRes = await request.post('/openApi/user/login', JSON.stringify(loginData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 保存 token  
    localStorage.setItem('token', loginRes.data.token);

    // 保存用户信息到本地存储  
    localStorage.setItem('userInfo', JSON.stringify(loginRes.data));

    return loginRes;
}

// 忘记密码
export const userForgotPasswordService = (forgotPasswordData) => {
    var params = new URLSearchParams()
    for (let key in forgotPasswordData) {
        params.append(key, forgotPasswordData[key])
    }
    return request.post('/openApi/user/forgetPassword', params)
}


// 发送邮箱验证码
export const sendEmailService = (email) => {
    return request.post('/openApi/user/sendEmail?email=' + email);
}



// =========================需要请求头===========================

// 用户登出
export const logoutService = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/user/logout', {}, {
        headers: {
            Authorization: token,
        },
    });

    return response.data;
};
// 修改用户信息
export const updateUserInfoService = async (userInfo) => {
    const token = localStorage.getItem('token');
    const response = await request.post('/user/updateUserInfo', JSON.stringify(userInfo), {
        headers: { Authorization: token },
    });
    return response.data;
};
// 修改用户密码
export const updateUserPasswordService = (passwordInfo) => {
    const token = localStorage.getItem('token');
    const response = request.post('/user/updatePassword', JSON.stringify(passwordInfo), {
        headers: { Authorization: token },
    });
    return response.data;
}

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
    try {
        const token = localStorage.getItem('token');
        const response = await request.put('/organization/updateRole', JSON.stringify(data), {
            headers: { Authorization: token, 'Content-Type': 'application/json' },
        });

        if (response.code != 0) {
            throw new Error(`更新用户角色失败，状态码: ${response.code}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating user role:', error);
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

//------------------------------文件上传接口------------------------------
//文件上传接口,任务执行前需要上传文件返回文件地址
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
