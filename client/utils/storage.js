let dbName = 'RgerData';
let dbNameActivty = 'RgerActivty';
let dbNameUser = 'RgerUser';
let
    token = 'sv=2016-05-31&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-03-05T20:51:54Z&st=2017-06-27T12:51:54Z&spr=https&sig=8qwJvDv4i%2FVhV%2F8uYi14B6JkYo45IAfBBoBj3afL92c%3D';
let url_data = 'https://ellise.table.core.windows.net';
let tableName = 'ettest';
let tableConversationName = 'message';
let tableUsersName = 'users';
let tableActiviteUserNumber = 'activiteUserNumber';
let tableLog = 'log';
let tableTeam = 'activiteTeam';
let filter_allList = "$filter=PartitionKey%20eq%20'activite'";

let getInsertUrl = function(table = tableName) {
    table = table || tableName;
    // console.log(url_data + '/' + table + '?' + token);
    return url_data + '/' + table + '?' + token;
}

let getUpdateUrl = function(partitionKey, rowKey, table = tableName) {
    table = table || tableName;
    return url_data + '/' + table + `(PartitionKey='${partitionKey}',RowKey='${rowKey}')` + '?' + token;
}

let getAllListUrl = function(date) {
    let dateFilter = '';
    if (!!date) {
        dateFilter = "%20and%20date%20ge%20'" + date + "'";
    }
    // token = 'sv=2016-05-31&ss=bfqt&srt=sco&sp=rwdlacup&se=2020-03-05T20:51:54Z';
    // console.log(url_data + '/' + tableName + '?'+ filter_allList+dateFilter + '&'+token );
    return url_data + '/' + tableName + '?' + filter_allList + dateFilter + '&' + token;
}

let getFilterUrl = function(strfilter, table = tableName) {
    table = table || tableName
        // console.log('filterurl====>'+url_data + '/' + table + '?' + strfilter + '&' + token);
    return url_data + '/' + table + '?' + strfilter + '&' + token;
}


let loadUserList = function(activiteId, cb_success, cb_failure) {
    // console.log('storage => load userid aid=' + activiteId);
    let filterStr = "$filter=PartitionKey%20eq%20'user'%20and%20activiteId%20eq%20'" + activiteId + "'";
    let urlgetuserList = getFilterUrl(filterStr);
    console.log(urlgetuserList);
    if (!cb_failure)
        cb_failure = err => {
            wx.redirectTo({
                url: "../error/error?msg=网络连接好慢啊，请重试",
            });
        };
    wx.request({
        url: urlgetuserList,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });



    // ------------------ cloud storage -------------------------

    // let db = wx.cloud.database();
    // let queryObj = {
    //   PartitionKey: 'user',
    //   activiteId: activiteId
    // };
    // console.log('query==>', queryObj);
    // db.collection(dbNameUser).where(queryObj)
    //   .get({
    //     success(res) {
    //       // res.data 是包含以上定义的两条记录的数组
    //       console.log(res.data)
    //     }
    //   })
}

let cloudLoadUserList = function(activiteId, cb_success, cb_failure) {
    let db = wx.cloud.database();
    let queryObj = {
        PartitionKey: 'user',
        activiteId: activiteId
    };
    console.log('loadUserListCloud==>', queryObj);
    db.collection(dbNameUser).where(queryObj)
        .get({
            success: cb_success,
            fail: cb_failure
        })
}

let insertData = (data, cb_success, cb_failure) => {
    console.log('storage => insert data');
    let url = getInsertUrl();
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
            storage.log(err);
        };
    wx.request({
        url: url,
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });

    //------------------ cloud storage ----------------------

    // wx.cloud.init({
    //   env: 'rger-8907ce'
    // });

    // let db = wx.cloud.database();
    // db.collection('RgerData').add({
    //     // data 字段表示需新增的 JSON 数据
    //     data: data,
    //     success(res) {
    //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
    //         console.log('data inserted =====>', res)
    //     }
    // });

}


let cloudInsertDataActivity = (data, cb_success, cb_failure) => {
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
            storage.log(err);
        };
    console.log('cloud storage => insert activity data');
    let db = wx.cloud.database();
    db.collection(dbNameActivty).add({
        data: data,
        success: cb_success,
        fail: cb_failure
    });
}

let cloudInsertDataUser = (data, cb_success, cb_failure) => {
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
            storage.log(err);
        };
    console.log('cloud storage => insert User data');
    let db = wx.cloud.database();
    db.collection(dbNameUser).add({
        data: data,
        success: cb_success,
        fail: cb_failure
    });
}


let updateData = (partitionKey, rowKey, data, cb_success, cb_failure) => {
    // console.log('storage => update data');
    let url = getUpdateUrl(partitionKey, rowKey);
    console.log('updateData', url, data);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    wx.request({
        url: url,
        method: 'PUT',
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: data,
        success: cb_success,
        fail: cb_failure
    });
}

let queryData = (filterStr, cb_success, cb_failure) => {
    let url = getFilterUrl(filterStr);
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    wx.request({
        url: url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}

let cloudSearchUserData = (searchObj, cb_success, cb_failure) => {
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    let db = wx.cloud.database();
    db.collection(dbNameUser).where(searchObj)
        .get({
            success: cb_success,
            fail: cb_failure
        })
}

let deleteData = (PartitionKey, RowKey, cb_success, cb_failure) => {

    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };

    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };

    let url = url_data + '/' + tableName + `(PartitionKey='${PartitionKey}',RowKey='${RowKey}')` + '?' + '&' + token;
    // let url = url_data + '/' + tableName + '?' + `(PartitionKey='${PartitionKey}',RowKey='${RowKey}')` + '&' + token;
    console.log('delete data====>' + url);
    wx.request({
        url: url,
        method: 'DELETE',
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'If-Match': '*'
        },
        success: cb_success,
        fail: cb_failure
    });
}


let cloudDeleteUser = (id, cb_success, cb_failure) => {

        if (!cb_success)
            cb_success = resp => {
                console.log(resp);
            };

        if (!cb_failure)
            cb_failure = err => {
                console.error(err);
            };
        console.log('cloud storage => delete User data');
        let db = wx.cloud.database();
        db.collection(dbNameUser).doc(id).remove({
            success: cb_success,
            fail: cb_failure
        });
    }
    //userinfo
    //----------------------------------------------

let insertUserInfoData = (data, cb_success, cb_failure) => {
    console.log('storage => insert UserInfo data');
    let url = getInsertUrl(tableUsersName);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
            storage.log(err);
        };
    wx.request({
        url: url,
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}

//conversation
//----------------------------------------------
let insertConversation = (data, cb_success, cb_failure) => {
    console.log('storage => Conversation');
    let url = getInsertUrl(tableConversationName);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    wx.request({
        url: url,
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}


let getMessageByActiviteId = (activiteId, cb_success, cb_failure) => {
    let filterStr = `$filter=PartitionKey%20eq%20'message'%20and%20activiteId%20eq%20'${activiteId}'`;
    let url = getFilterUrl(filterStr, tableConversationName);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    wx.request({
        url: url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}


//activite-user
//----------------------------------------------
let getActiviteUser = (cb_success, cb_failure) => {
    // let filterStr = `$filter=PartitionKey%20eq%20'message'%20and%20activiteId%20eq%20'${activiteId}'`;
    let url = getFilterUrl('', tableActiviteUserNumber);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.log('connection break');
            wx.redirectTo({
                url: "../error/error?msg='" + '网络不通畅，请稍后再试' + "'",
            });
        };
    wx.request({
        url: url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}

let updateActiviteUserNumber = (activiteId, userNumber, cb_success, cb_failure) => {
    // console.log('storage => udpate ActiviteUserNumber');
    let updateFlag = true;
    let rowKey = '';
    let filterStr = "$filter=PartitionKey%20eq%20'ActiviteUserNumber'%20and%20activiteId%20eq%20'" + activiteId + "'";
    let exists_url = getFilterUrl(filterStr, tableActiviteUserNumber);
    wx.request({
        url: exists_url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: resp => {
            // console.log('data is -------------------');
            // console.log(resp.data);
            updateFlag = (resp.data.value.length > 0) ? true : false;
            rowKey = updateFlag ? resp.data.value[0].RowKey : Date.now().toString();
            console.log('actUserNum updateFlag:' + updateFlag);

            let verb = updateFlag ? 'PUT' : 'POST';
            let url = updateFlag ? getUpdateUrl('ActiviteUserNumber', rowKey, tableActiviteUserNumber) : getInsertUrl(tableActiviteUserNumber);

            if (!cb_success)
                cb_success = resp => {
                    console.log(resp);
                };
            if (!cb_failure)
                cb_failure = err => {
                    console.error(err);
                };
            let data = {
                PartitionKey: 'ActiviteUserNumber',
                RowKey: rowKey,
                activiteId: activiteId,
                userNumber: userNumber
            }
            console.log('actUserNum - ' + url);
            wx.request({
                url: url,
                method: verb,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                success: cb_success,
                fail: cb_failure
            });
        }
    });

}

//team msg
//------------------------------------------------------------------------
let getTeamInfo = (activiteId, cb_success, cb_failure) => {
    let filterStr = "$filter=PartitionKey%20eq%20'team'%20and%20activiteId%20eq%20'" + activiteId + "'";
    let exists_url = getFilterUrl(filterStr, tableTeam);
    wx.request({
        url: exists_url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}

let updateTeamInfo = (activiteId, teamInfo, cb_success, cb_failure) => {
    // console.log('storage => udpate ActiviteUserNumber');
    let updateFlag = true;
    let rowKey = '';
    let filterStr = "$filter=PartitionKey%20eq%20'team'%20and%20activiteId%20eq%20'" + activiteId + "'";
    let exists_url = getFilterUrl(filterStr, tableTeam);
    wx.request({
        url: exists_url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: resp => {
            // console.log('data is -------------------');
            // console.log(resp.data);
            updateFlag = (resp.data.value.length > 0) ? true : false;
            rowKey = updateFlag ? resp.data.value[0].RowKey : Date.now().toString();
            console.log('updateTeam updateFlag:' + updateFlag);

            let verb = updateFlag ? 'PUT' : 'POST';
            let url = updateFlag ? getUpdateUrl('team', rowKey, tableTeam) : getInsertUrl(tableTeam);

            if (!cb_success)
                cb_success = resp => {
                    console.log(resp);
                };
            if (!cb_failure)
                cb_failure = err => {
                    console.error(err);
                };
            let data = {
                PartitionKey: 'team',
                RowKey: rowKey,
                activiteId: activiteId,
                teamInfo: JSON.stringify(teamInfo)
            }
            console.log('udpateTeam - ' + url);
            wx.request({
                url: url,
                method: verb,
                data: data,
                header: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                success: cb_success,
                fail: cb_failure
            });
        }
    });

}


let log = (msg, cb_success, cb_failure) => {
    console.log('storage => insert log');
    let url = getInsertUrl(tableLog);
    if (!cb_success)
        cb_success = resp => {
            wx.redirectTo({
                url: "../error/error?msg=真抱歉，系统出错了T_T",
            });
        };
    if (!cb_failure)
        cb_failure = err => {
            wx.redirectTo({
                url: "../error/error?msg=网络连接好慢啊，请重试",
            });
        };
    let data = {
        "PartitionKey": "log",
        "RowKey": Date.now().toString(),
        "msg": msg
    };
    wx.request({
        url: url,
        method: 'POST',
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}


let getUserConfig = (userId, cb_success, cb_failure) => {
    let filterStr = `$filter=id%20eq%20'${userId}'`;
    let url = getFilterUrl(filterStr, tableUsersName);
    console.log(url);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    wx.request({
        url: url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}


let insertUserConfig = (userId, customName, cb_success, cb_failure) => {
    let filterStr = `$filter=id%20eq%20'${userId}'`;
    let url = getFilterUrl(filterStr, tableUsersName);
    console.log(url);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    wx.request({
        url: url,
        method: 'GET',
        header: {
            Accept: 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}

let updateUserConfig = (dataUserConfig, cb_success, cb_failure) => {
    // console.log('storage => udpate ActiviteUserNumber');
    let url = getUpdateUrl(dataUserConfig.PartitionKey, dataUserConfig.RowKey, tableUsersName);
    // console.log('updateUserConfig',url);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    let data = {
        customEmail: dataUserConfig.customEmail,
        englishName: dataUserConfig.englishName,
        id: dataUserConfig.nickName
    }
    console.log('updateUserConfig - ' + url, data);
    wx.request({
        url: url,
        method: 'PUT',
        data: data,
        header: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        success: cb_success,
        fail: cb_failure
    });
}


let cloudInsertUserConfig = (data, cb_success, cb_failure) => {
    console.log('storage => insert UserInfo data');
    let url = getInsertUrl(tableUsersName);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
            storage.log(err);
        };
    let db = wx.cloud.database();
    db.collection(dbName).add({
        // data 字段表示需新增的 JSON 数据
        data: data,
        success: cb_success,
        fail: cb_failure
    });
}

let cloudUpdateUserConfig = (dataUserConfig, cb_success, cb_failure) => {
    // console.log('updateUserConfig',url);
    if (!cb_success)
        cb_success = resp => {
            console.log(resp);
        };
    if (!cb_failure)
        cb_failure = err => {
            console.error(err);
        };
    console.log('cloud updateUserConfig - ', dataUserConfig);
    let db = wx.cloud.database();
    db.collection(dbName).doc(dataUserConfig._id).update({
        // data 传入需要局部更新的数据
        data: dataUserConfig,
        success: cb_success,
        fail: cb_failure
    });
}

module.exports = {
    token,
    url_data,
    tableName,
    getInsertUrl,
    getAllListUrl,
    getFilterUrl,
    loadUserList,
    insertData,
    updateData,
    queryData,
    deleteData,
    insertConversation,
    getMessageByActiviteId,
    getActiviteUser,
    updateActiviteUserNumber,
    getTeamInfo,
    updateTeamInfo,
    log,
    getUserConfig,
    insertUserInfoData,
    updateUserConfig,
    cloudLoadUserList,
    cloudInsertDataActivity,
    cloudInsertDataUser,
    cloudDeleteUser,
    cloudSearchUserData,
    cloudInsertUserConfig,
    cloudUpdateUserConfig
}