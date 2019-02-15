// pages/activiteDetail/activiteDetail.js
var app = getApp();
var storage = require('../../utils/storage.js');
var email = require('../../utils/email.js');
var util = require('../../utils/util.js');
var lang = require('../../i18n/lang.js');

let messageLoader;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lang: lang[app.globalData.lang],
        btnLangText: app.globalData.langSet[app.globalData.langSetIndex],

        isAdmin: false,
        dateNow: '',
        onShare: false,
        onShareStatus: false,
        menuDisplay: true,
        showHelp: false,
        loading: true,
        title: '',
        content: '',
        userList: [],
        userInfo: {},
        activite: {},
        activiteId: '',
        nickName: '',
        joinAlready: false,
        activiteLocation: {},
        messageList: [],
        requesting: true,
        openMessageBoard: false,
        message: '',
        lastMessageRowKey: '',
        messageEntering: false,
        lastMessage: '',
        teamGroup: [],
        kickOutEnable: false,
        nickNameInput: false,
        openExtractInfo: false,
        showEmailDialog: false,
        errorEmail: '',
        customNameFocus: false,
        customEmailFocus: false,
        customEmail: '',
        customName: ''
    },
    switchLang(e) {
        app.globalData.langSetIndex = (app.globalData.langSetIndex + 1) % 2;
        app.globalData.lang = app.globalData.langSet[app.globalData.langSetIndex];
        this.setData({
            lang: lang[app.globalData.lang],
            showMenu: !this.data.showMenu
        });
    },
    onShow: function(e) {
        let that = this;
        messageLoader = setInterval(() => {
            if (!that.data.requesting) {
                that.loadMessage(that.data.activiteId);
            }
        }, 1000);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            lang: lang[app.globalData.lang]
        });

        let that = this;
        let finishUser = false;
        let finishdData = false;
        let filterStr = "$filter=RowKey%20eq%20'" + options.id + "'";
        let data_userInfo;
        let data_title;
        let data_content;
        let data_activite;
        let data_activiteId;
        let data_activiteLocation;
        let data_requesting;
        let data_loading;

        app.getUserInfo(function(userInfo) {
                console.log(userInfo);
                data_userInfo = userInfo;
                finishUser = true;

                storage.queryData(filterStr,
                    resp => {
                        let a = resp.data.value[0];
                        //如果活动不存在，跳转到出错页面
                        if (!a) {
                            wx.redirectTo({
                                url: "../error/error?msg='" + '不好意思，活动已取消-_-!' + "'",
                            });
                            return;
                        }
                        let day = (new Date(a.date || Date())).getDay();
                        a.dayOfWeek = that.data.lang.weekDay[day];
                        a.location = a.location || '{}';
                        data_title = a.title;
                        data_content = a.content;
                        data_activite = a;
                        data_activiteId = options.id;
                        data_activiteLocation = JSON.parse(a.location);
                        data_requesting = false;
                        finishdData = true;
                        let isAdminFlag = app.globalData.admin == data_userInfo.nickName;

                        let isAdminDate = isAdminFlag ? '1980-01-01' : util.formatTime(new Date()).replace(/\d{2}:\d{2}:\d{2}/, '').trim();
                        console.log('pageload', app.globalData.userInfo.englishName);
                        that.setData({
                            isAdmin: isAdminFlag,
                            dateNow: isAdminDate,
                            userInfo: data_userInfo,
                            title: data_title,
                            content: data_content,
                            activite: data_activite,
                            activiteId: data_activiteId,
                            activiteLocation: data_activiteLocation,
                            requesting: data_requesting,
                            customName: app.globalData.userInfo.englishName,
                            customEmail: app.globalData.userInfo.customEmail
                        });
                        // let userInfo = this.data.userInfo;
                        that.loadUserList(options.id);
                    },
                    err => console.error(err)
                );
            },
            function(e) {
                console.error(e);
            });


        // console.log('load userlist aid=' + options.id);

        // that.loadMessage(options.id);
        // //load message
        // messageLoader = setInterval(() => {
        //   if (!that.data.requesting) {
        //     // console.log('go request ' + options.id);
        //     that.loadMessage(options.id);
        //   }
        // }, 1000);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        let that = this;
        clearInterval(messageLoader);
        // let messageListErr = that.data.messageList;
        // messageListErr.push({
        //   creator: 'System',
        //   message: '留言板连接已断开，请重新进入页面'
        // });
        // that.setData({
        //   messageList: messageListErr,
        //   requesting: false
        // });
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(messageLoader);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        this.setData({
            menuDisplay: false,
            onShareStatus: true
        });
        setTimeout(() => {
            that.setData({
                menuDisplay: true,
                onShareStatus: false
            });
        }, 500);
        let that = this;
        return {
            title: this.data.activite.title,
            desc: this.data.activite.content,
            path: '/pages/activiteDetail/activiteDetail?id=' + this.data.activiteId
        }
    },
    /*
     *私有功能函数
     */

    loadUserList(activiteId) {
        let that = this;
        // console.log('actId=' + activiteId);
        // storage.loadUserList(activiteId,
        //   resp => {
        //     let enrolledflag = false;
        //     let userInfo = that.data.userInfo;
        //     for (let i of resp.data.value) {
        //       if (i.nickName == userInfo.nickName) {
        //         enrolledflag = true;
        //         break;
        //       }
        //     }
        //     console.log(userInfo.nickName + '|' + enrolledflag);
        //     let userList = resp.data.value;
        //     let updateNumberFlag = userList.length != that.data.userList.length
        //     that.setData({
        //       userList: userList,
        //       joinAlready: enrolledflag,
        //       loading: false
        //     });
        //     if (updateNumberFlag) {
        //       // console.log('loadUserList=>updateNumber');
        //       storage.updateActiviteUserNumber(that.data.activiteId, userList.length);
        //     }
        //   },
        //   e => {
        //     console.log(e);
        //   });
        console.log('cloudLoadUserList');
        storage.cloudLoadUserList(activiteId,
            resp => {
                console.log('resp===>', resp);
                let enrolledflag = false;
                let userInfo = that.data.userInfo;
                for (let i of resp.data) {
                    if (i.nickName == userInfo.nickName) {
                        enrolledflag = true;
                        break;
                    }
                }
                console.log(userInfo.nickName + '|' + enrolledflag);
                let userList = resp.data;
                let updateNumberFlag = userList.length != that.data.userList.length
                that.setData({
                    userList: userList,
                    joinAlready: enrolledflag,
                    loading: false
                });
                // if (updateNumberFlag) {
                //   storage.updateActiviteUserNumber(that.data.activiteId, userList.length);
                // }
            },
            e => {
                console.log(e);
            });
    },
    quitAct(userNickname) {
        for (let i in this.data.userList) {
            if (this.data.userList[i].nickName == userNickname) {
                // console.log(this.data.userList[i]);
                // storage.deleteData(this.data.userList[i].PartitionKey,
                //   this.data.userList[i].RowKey,
                //   resp => {
                //     this.loadUserList(this.data.activiteId);
                //     wx.hideLoading();
                //   });
                console.log('user _id ===>' + i, this.data.userList[i]._id)
                storage.cloudDeleteUser(this.data.userList[i]._id,
                    resp => {
                        this.loadUserList(this.data.activiteId);
                        console.log('user deleted');
                        wx.hideLoading();
                    });
                break;
            }
        }
    },
    updateActivite(e) {
        wx.redirectTo({
            url: '../activite/activite?id=' + this.data.activiteId
        });
    },
    copyActivite(e) {
        wx.redirectTo({
            url: `../activite/activite?id=${this.data.activiteId}&isCopy=true`
        });
    },
    saveCustomName(e) {
        //close menu
        this.closeExtractInfo(e);
        let that = this;
        if (!!this.data.customName) {
            console.log("customName", this.data.customName);
            let rowKey = Date.now().toString();
            let dataUserConfig = {
                "PartitionKey": "userinfo",
                "RowKey": rowKey,
                "_id": rowKey,
                "englishName": this.data.customName,
                "customEmail": this.data.customEmail,
                "id": this.data.userInfo.nickName
            };
            if (!app.globalData.userInfo.englishName) {
                storage.insertUserInfoData(dataUserConfig,
                    resp => {
                        app.globalData.userInfo.englishName = this.data.customName;
                        console.log('dataUserConfig', app.globalData.userInfo.englishName);
                        if (!this.data.joinAlready) {
                            this.submitActivite(e);
                        }
                    });
                storage.cloudInsertUserConfig(dataUserConfig,
                    resp => {
                        app.globalData.userInfo.englishName = this.data.customName;
                        console.log('cloud insert dataUserConfig', app.globalData.userInfo.englishName);
                        if (!this.data.joinAlready) {
                            this.submitActivite(e);
                        }
                    });
            } else {
                let updateSuccess = resp => {
                    let updateRowKey;
                    for (let i in that.data.userList) {
                        if (that.data.userList[i].nickName == that.data.userInfo.nickName) {
                            updateRowKey = that.data.userList[i].RowKey;
                            that.data.userList[i].englishName = app.globalData.userInfo.englishName;
                            break;
                        }
                    }
                    let data = {
                        "activiteId": that.data.activiteId,
                        "PartitionKey": "user",
                        "RowKey": updateRowKey,
                        "nickName": that.data.userInfo.nickName,
                        "avatarUrl": that.data.userInfo.avatarUrl,
                        "gender": that.data.userInfo.gender,
                        "customName": app.globalData.userInfo.englishName
                    };

                    //let updateData = (partitionKey, rowKey, data, cb_success, cb_failure)
                    storage.updateData(data.PartitionKey, data.RowKey, data,
                        resp => {
                            that.loadUserList(that.data.activiteId);
                            wx.hideLoading();
                        }
                    );
                };
                app.globalData.userInfo.englishName = this.data.customName;
                storage.updateUserConfig(app.globalData.userInfo, updateSuccess)
                return;
            }
        }
    },
    openEmailDialog(e) {
        console.log('showEmailDialog');
        this.setData({
            showEmailDialog: true,
            customEmailFocus: true,
            showMenu: false,
        });
    },

    closeEmailDialog(e) {
        this.setData({
            showEmailDialog: false,
            customEmailFocus: false,
            showMenu: false,
        });
    },
    saveCustomEmail(e) {

        // email validation
        if (!/[a-z0-9-]{1,30}@[a-z0-9-]{1,65}.[a-z]{3}/.test(this.data.customEmail)) {
            this.setData({
                errorEmail: this.data.lang.errorEmail
            });
            return;
        } else {
            this.setData({
                errorEmail: ''
            });
        }

        //close email window
        this.closeEmailDialog();
        let that = this;
        if (this.data.customEmail + this.data.customName == "")
            return;

        if ((!!this.data.customEmail || !!this.data.customName) && (app.globalData.userInfo.customEmail != this.data.customEmail)) {
            console.log("save customEmail", this.data.customEmail);
            let dataUserConfig = {
                "PartitionKey": "userinfo",
                "RowKey": Date.now().toString(),
                "englishName": this.data.customName,
                "customEmail": this.data.customEmail,
                "id": this.data.userInfo.nickName
            };
            if (!app.globalData.userInfo.RowKey) {
                console.log('insert email');
                storage.insertUserInfoData(dataUserConfig,
                    resp => {
                        app.globalData.userInfo.customEmail = this.data.customEmail;
                        console.log('dataUserConfig customEmail', app.globalData.userInfo.customEmail);
                    });
            } else {
                console.log('update email');
                let updateSuccess = resp => {
                    console.log("email update success");
                };
                app.globalData.userInfo.customEmail = this.data.customEmail;
                storage.updateUserConfig(app.globalData.userInfo, updateSuccess)
            }
        }

        this.sendEmailReport();
    },
    submitActivite(e) {
        //show the extract info tag
        // console.log('app.globalData.userInfo.englishName=' + app.globalData.userInfo.englishName, !app.globalData.userInfo.englishName);
        // return;


        if (this.data.activite.requireEnglishName && !app.globalData.userInfo.englishName) {
            this.changeCustomName();
            return;
        }


        var url = storage.getInsertUrl();
        let userInfo = this.data.userInfo;
        let that = this;

        wx.showLoading({
            title: '加入中...',
            mask: true
        });

        let filterStr = "$filter=PartitionKey%20eq%20'user'%20and%20activiteId%20eq%20'" + that.data.activiteId + "'and%20nickName%20eq%20'" + userInfo.nickName + "'";

        let urlgetuser = storage.getFilterUrl(filterStr);
        storage.queryData(filterStr,
            resp => {
                if (resp.data.value == undefined || resp.data.value.length == 0) {
                    that.enrollActivite();
                }
            }
        );
        let filterObj = {
            activiteId: that.data.activiteId,
            nickName: userInfo.nickName
        };
        storage.cloudSearchUserData(filterObj,
            resp => {
                if (resp.data.value == undefined || resp.data.value.length == 0) {
                    that.enrollActivite();
                }
            })
    },
    enrollActivite() {
        // console.log('enroll');
        var url = storage.getInsertUrl();
        let userInfo = this.data.userInfo;
        let that = this;

        //check if the limit is reached
        that.loadUserList(that.data.activiteId);

        console.log('insertData');
        if (!!this.data.activite.peopleLimit && this.data.userList.length >= this.data.activite.peopleLimit) {
            wx.hideLoading();
            wx.showModal({
                content: this.data.lang.limitReach,
                showCancel: false,
                success: function(res) {
                    if (res.confirm) {}
                }
            });
            return;
        } else {
            let data = {
                "PartitionKey": "user",
                "RowKey": Date.now().toString(),
                "nickName": userInfo.nickName,
                "avatarUrl": userInfo.avatarUrl,
                "gender": userInfo.gender,
                "activiteId": that.data.activiteId,
                "customName": app.globalData.userInfo.englishName
            };

            storage.insertData(data,
                resp => {
                    that.loadUserList(that.data.activiteId);
                    wx.hideLoading();
                }
            );

            storage.cloudInsertDataUser(data,
                resp => {
                    that.loadUserList(that.data.activiteId);
                    wx.hideLoading();
                }
            );
        }
    },
    quitActivite(e) {
        this.quitAct(this.data.userInfo.nickName);
    },
    openMap(e) {
        console.log(this.data.activiteLocation);
        wx.openLocation({
            name: this.data.activiteLocation.title,
            latitude: this.data.activiteLocation.location.lat,
            longitude: this.data.activiteLocation.location.lng,
            scale: 50,
        });
    },

    /*-------------------------------功能函数--------------------------------*/
    // send email
    sendEmailReport(e) {
        console.log("sendEmail");
        wx.showLoading({
            title: "sending...",
            mask: true
        });
        let cb_success = (resp) => {
            console.log(resp);
            wx.hideLoading();
            wx.showToast({
                title: "Report Sent.",
                duration: 500
            })
            console.log("sendEmail complete");
        };
        let cb_failure = (err) => {
            console.error(err);
        };
        let url = "https://sendcloud.sohu.com/apiv2/mail/send";

        let emailBody = email.template;
        emailBody = emailBody.replace("{title}", this.data.activite.title);
        emailBody = emailBody.replace("{content}", this.data.activite.content);
        emailBody = emailBody.replace("{time}", this.data.activite.date + this.data.activite.dayOfWeek + this.data.activite.time);

        emailBody = emailBody.replace("{joinNum}", this.data.userList.length);
        let joiners = '<ol>';
        for (let p of this.data.userList) {
            joiners += `<li>${this.data.activite.requireEnglishName ? (p.customName || p.nickName) : p.nickName}</li>`;
        }
        joiners += '</ol>';
        emailBody = emailBody.replace("{joiner}", joiners);

        let data = {
            apiUser: "tianxin459",
            apiKey: "Oni5mnpKARSexrnG",
            from: "Together@ellist.cn",
            to: this.data.customEmail,
            subject: "Activity Report: " + this.data.activite.title + " (" + this.data.activite.date + this.data.activite.dayOfWeek + this.data.activite.time + ")",
            html: emailBody
        };
        console.log("send email");

        wx.request({
            url: url,
            method: 'Post',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: data,
            success: cb_success,
            fail: cb_failure
        });
    },
    // message
    //------------------------------------------------------
    submitMessage(e) {
        // console.log(e.detail.value.message);
        // let msg = e.detail.value.message;
        if (this.data.message.trim() == '')
            return;
        let data = {
            "PartitionKey": "message",
            "RowKey": Date.now().toString(),
            "creator": this.data.userInfo.nickName,
            "activiteId": this.data.activiteId,
            "message": this.data.message
        };
        storage.insertConversation(data,
            resp => {
                // console.log('success add message');
                // console.log(resp);
                this.setData({
                    message: ''
                });
            })
    },
    loadMessage(activiteId) {
        let that = this;
        that.setData({
            requesting: true
        });
        storage.getMessageByActiviteId(activiteId,
            resp => {
                //set the lastMessageRowKey separately for rendering the page
                let lastMsgRowKey = (resp.data.value == undefined || resp.data.value.length == 0) ? '' : resp.data.value[resp.data.value.length - 1].RowKey
                    // let lastMsgRowKey = resp.data.value.length > 0 ? resp.data.value[resp.data.value.length - 1].RowKey : '';

                that.setData({
                    messageList: resp.data.value,
                    requesting: false,
                    lastMessageRowKey: lastMsgRowKey,
                });
            },
            err => {
                clearInterval(messageLoader);
                let messageListErr = that.data.messageList;
                messageListErr.push({
                    creator: 'System',
                    message: this.data.lang.connnectionBreak
                });
                that.setData({
                    messageList: messageListErr,
                    requesting: false
                });
            }
        );
    },
    toggleMessageBoard(e) {
        let boardOpen = !this.data.openMessageBoard;
        this.setData({
            openMessageBoard: boardOpen,
            menuDisplay: !boardOpen
        });
    },
    inputMessage(e) {
        // console.log(e.detail.value);
        this.setData({
            message: e.detail.value
        });
    },
    focusNickName: function(e) {
        this.setData({
            nickNameInput: true
        });
        console.log(this.data.nickNameInput);
    },
    inputCustomName: function(e) {
        this.setData({
            customName: e.detail.value,
            // titleInput: !!e.detail.value
        });
    },
    inputCustomEmail: function(e) {
        this.setData({
            customEmail: e.detail.value
        });
    },
    focusMessage(e) {
        this.setData({
            messageEntering: true
        });
    },
    blurMessage(e) {
        console.log('blur');
        this.setData({
            messageEntering: false
        });
    },
    onShare(e) {
        wx.showShareMenu({
            withShareTicket: true,
            success: resp => {
                console.log(resp);
            }
        })
    },
    hideHelp(e) {
        console.log('hidehelp');
        this.setData({
            showHelp: false
        })
    },
    //teamup
    //--------------------------------------------
    teamUp(e) {
        let teamArray = new Array();
        this.data.userList.sort((a, b) => {
            return Math.random() > 0.5 ? -1 : 1;
        }).forEach((u) => {
            teamArray.push({
                avatarUrl: u.avatarUrl,
                nickName: u.nickName
            });
        });
        this.data.teamGroup = teamArray;
        // console.log(JSON.stringify(this.data.teamGroup));
        wx.setStorageSync("team", this.data.userList);
        wx.navigateTo({
            url: '../activiteTeam/activiteTeam?activiteId=' + this.data.activiteId
        });
    },
    toggleMenu(e) {
        this.setData({
            showMenu: !this.data.showMenu
        });
    },
    goToHome: function(e) {
        wx.navigateTo({
            url: '../activiteList/activiteList',
        })
    },
    //avatar - related
    kickOutClick: function(e) {
        //return;//save for later
        let that = this;
        let tid = e.target.id;
        that.quitAct(tid);
        // that.kickout(tid);
    },
    toggleKickOut(e) {
        let that = this;
        that.setData({
            kickOutEnable: !that.data.kickOutEnable
        });
    },
    changeCustomName(e) {
        console.log(app.globalData.userInfo);
        this.openExtractInfo();
        this.setData({
            customNameFocus: true
        });
    },
    openExtractInfo(e) {
        this.setData({
            openExtractInfo: true,
            customNameFocus: true
        });
        console.log(this.data.openExtractInfo, this.data.customName);
    },
    closeExtractInfo(e) {
        this.setData({
            openExtractInfo: false,
            customNameFocus: false
        });
    }
})