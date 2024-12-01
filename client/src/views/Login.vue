<template>
  <div class="login-box" v-show="showLogin">
    <div class="login-left">
      <p>Welcome to</p>
      <h1>Kayron 聊天室</h1>
    </div>
    <div class="login-right">
      <div class="username">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div class="choose-avatar">
        <label for="avatar">选择头像</label>
        <div class="avatar-list">
          <div
            v-for="i in 10"
            :key="i"
            :class="['item', { current: avatar === i }]"
            @click="chooseAvatar(i)"
          >
            <img :src="getImage(i)" alt="" />
          </div>
        </div>
      </div>
      <button @click="login">登录</button>
    </div>
  </div>
  <Room 
    v-show="!showLogin"
    ref="roomRef"
    :user="user!" 
    :userList="userList"
    @send="sendToServer"
  />
</template>

<script lang="ts">
export default {
  name: "Login",
};
</script>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import io from "socket.io-client"; //引入socket.io-client
import { userInfo } from '@/types/common'
import Room from './Room.vue'

const username = ref<string>("");
const avatar = ref<number>();
const chooseAvatar = (val: number) => {
  avatar.value = val;
};
// 动态引入图片
const getImage = (num: number) => {
  // 不能使用通配符等等，只能使用相对路径
  return new URL(`../assets/imgs/avatar${num}.jpeg`, import.meta.url).href;
}
const showLogin = ref<boolean>(true)
const roomRef = ref()

// 当前用户
const user = ref<userInfo>()
const userList = ref<userInfo[]>([]);
const socket = ref<any>(null);
const login = () => {
  if (!username.value) {
    alert("请输入用户名");
    return false;
  } else if (avatar.value === undefined) {
    alert("请选择头像");
    return false;
  }
  socket.value.emit('login', {
    username: username.value,
    avatar: avatar.value,
  })
};

// 向服务端发送消息
const sendToServer = (msg: string | File, flag: 0 | 1 | 2) => {
  socket.value.emit('sendMessage', {
    msg,
    flag,
    username: username.value,
    avatar: avatar.value,
  })
}
onMounted(() => {
  // 连接服务器
  socket.value = io(import.meta.env.VITE_APP_URL);
  socket.value.on('connection', () => {
    console.log('socket连接成功')
  })
  socket.value.on('userExist', (data: { msg: string}) => {
    alert(data.msg)
  })
  socket.value.on('loginSuccess', (data: userInfo) => {
    alert('登录成功')
    user.value = data
    showLogin.value = false
  })
  socket.value.on('joinRoom', (data: userInfo) => {
    // 加一条系统消息    
    roomRef.value.joinOrLeaveMessage({
      username: '系统消息',
      msg: `${data.username}加入了聊天室`,
      flag: 0,
      type: 0,
      avatar: -1,
    })
  })
  socket.value.on('leaveRoom', (data: { username: string}) => {
    // 加一条系统消息
    roomRef.value.joinOrLeaveMessage({
      username: '系统消息',
      msg: `${data.username}离开了聊天室`,
      flag: 0,
      type: 0,
      avatar: -1,
    })
    roomRef.value.clearMessage()
  })
  socket.value.on('userList', (data: userInfo[]) => {
    userList.value = data
  })
  // 接收用户消息
  socket.value.on('receiveMessage', (data: any) => {
    roomRef.value.joinOrLeaveMessage({
      type: data.username === user.value!.username ? 1 : 2,
      ...data,
    })
  })
});
</script>

<style lang="less" scoped>
.login-box {
  width: 800px;
  height: 600px;
  margin: 150px auto 0;
  display: flex;
  .login-left,
  .login-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .login-left {
    width: 200px;
    color: #f1e9e9;
    background-color: rgba(59, 59, 59, 0.5);
    p {
      font-size: 18px;
    }
    h1 {
      margin-top: 10px;
    }
  }
  .login-right {
    flex: 1;
    background: #dbdbdbc0;
    label {
      display: block;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .username,
    .choose-avatar {
      width: 80%;
      overflow: hidden;
    }
    input {
      width: 100%;
      height: 30px;
      border: 1px solid #ccc;
      font-size: 14px;
      line-height: 30px;
      padding-left: 10px;
      display: block;
    }
    .choose-avatar {
      margin-top: 40px;
      .avatar-list {
        width: 100%;
        border: 1px solid rgba(61, 61, 61, 0.801);
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .item {
          width: 70px;
          height: 70px;
          margin: 5px;
          cursor: pointer;
          border: 2px solid transparent;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .current {
          border: 2px solid #0ba718;
        }
      }
    }
    button {
      padding: 10px 30px;
      font-size: 16px;
      margin-top: 50px;
      border-radius: 5px;
      background: #a0a0a0d8;
      color: #ffffff;
      letter-spacing: 5px;
    }
  }
}
</style>
