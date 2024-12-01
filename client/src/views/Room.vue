<template>
  <div class="chat-room" v-if="user">
    <div class="room-left">
      <img :src="getImage(user.avatar)" alt="" />
    </div>
    <div class="room-center">
      <div class="title">当前用户列表</div>
      <ul class="user-list">
        <li class="user-item" v-for="item in userList" :key="item.username">
          <img :src="getImage(item.avatar)" />
          <span>{{item.username}}</span>
        </li>
      </ul>
    </div>
    <div class="room-right">
      <div class="room-name">聊天室({{ userList.length }})</div>
      <div class="chat-content scrollbar" ref="chatContent">
        <div 
          v-for="(item, index) in messageList" 
          :key="index"
          :class="{
            systemMessage: item.type === 0,
            selfMessage: item.type === 1,
            otherMessage: item.type === 2,
          }"
        >
          <!-- 系统消息 -->
          <div v-if="item.type === 0">{{ item.msg }}</div>
          <!-- 自己发的 -->
          <div v-else-if="item.type === 1">
            <div class="message">
              <span v-if="item.flag == 0">{{item.msg}}</span>
              <img v-if="item.flag == 1" :src="item.msg" class="img-message" />
            </div>
            <img class="avatar" :src="getImage(item.avatar)" />  
          </div>
          <!-- 别人发的 -->
          <div v-else-if="item.type === 2">
            <div>
              <div class="name">{{ item.username }}</div>
              <div class="message">
                <span v-if="item.flag == 0">{{item.msg}}</span>
                <img v-if="item.flag == 1" :src="item.msg" class="img-message" />
              </div>
            </div>
            <img class="avatar" :src="getImage(item.avatar)" />  
          </div>
        </div>
      </div>
      <div class="send-message">
        <div class="actions">
          <span class="iconfont icon-smile" @click="emojiBox = !emojiBox"></span>
          <div class="emoji-box scrollbar" v-show="emojiBox" >
            <span
              v-for="item in emojiList"
              :key="item.codes"
              @click="handleEmoji(item)"
              >{{item.char}}</span>
          </div>
          <div class="send-img">
            <input id="upload" type="file" multiple="false" @change="uploadImg" />
            <label for="upload" class="iconfont icon-wenjianjia"></label>
          </div>
        </div>
        <div ref="inputContainer" 
          class="input-container" 
          contenteditable="plaintext-only" 
          @keyup.enter="sendMessage"
        ></div>
        <div class="send-button">
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Room",
};
</script>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from "vue";
import { userInfo, messageType } from '@/types/common'
import emoji from '../assets/emoji.json'

const props = defineProps<{
  user: userInfo
  userList: userInfo[]
}>()

const emit = defineEmits({
  send: (msg: string | File, flag: 0 | 1 | 2) => true,
})

const emojiList = ref<any[]>([])
const messageList = ref<messageType[]>([])
const chatContent = ref()
const emojiBox = ref<boolean>(false)

const getImage = (num: number) => {
  return new URL(`../assets/imgs/avatar${num}.jpeg`, import.meta.url).href;
}
const joinOrLeaveMessage = (obj: messageType) => {
  messageList.value.push(obj)
  nextTick(() => {
    // 滚动到底部
    chatContent.value?.scrollTo({
      top: chatContent.value.scrollHeight,
    })
  })
}

const inputContainer = ref()
const sendMessage = () => {
  const message = inputContainer.value.innerHTML
  if(!message) {
    alert('消息内容为空')
  } else {
    emit('send', message, 0)
    inputContainer.value.innerHTML = ''
    inputContainer.value.focus()
  }
}

const uploadImg = (event: any) => {
  const file: File = event.target.files[0]
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function(e) {
    var url = e.target!.result
    emit('send', url as string, 1)
  }
}

const handleEmoji = (emoji: any) => {
  inputContainer.value.innerHTML += emoji.char
  emojiBox.value = false
}

onMounted(() => {
  emojiList.value = emoji
})

defineExpose({
  joinOrLeaveMessage
})

</script>

<style lang="less" scoped>
.chat-room {
  width: 900px;
  height: 600px;
  margin: 150px auto 0;  
  display: flex;
  .room-left {
    width: 70px;
    padding-top: 10px;
    background-color: #c1bdc19c;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 50px;
    }
  }
  .room-center {
    width: 200px;
    background-color: #e6e6e6;
    display: flex;
    flex-direction: column;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      padding: 0px 10px;
      color: #4e4d4d;
      border-bottom: 1px solid #ccc;
    }
    .user-list {
      flex: 1;
      // overflow: hidden scroll;
      padding: 2px 10px;
      display: flex;
      flex-direction: column;
      .user-item {
        padding: 2px 0;
        height: 40px;
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          font-size: 14px;
          color: #4e4d4d;
          margin-left: 10px;
        }
      }
    }
  }
  .room-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    .room-name {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      border-bottom: 1px solid #e6e6e6;
    }
  }
}
// 聊天消息区
.chat-content {
  height: 400px;
  padding: 10px;
  overflow-y: auto;
  .systemMessage {
    text-align: center;
    color: #ccc;
    padding: 5px 0;
    border-radius: 10px;
  }
  .selfMessage > div, 
  .otherMessage > div {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 10px;
    .avatar {
      width: 40px;
      height: 40px;
    }
    .message {
      position: relative;
      border-radius: 5px;
      line-height: 40px;
      color: #000;
      padding: 0 10px;  
      &::after {
        position: absolute;
        content: '';
        top: 50%;
        transform: translateY(-50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;    
      }
      .img-message {
        margin: 5px 0;
        max-width: 300px;
        max-height: 150px;
      }
    }
  }
  .selfMessage > div {
    .message {
      margin-right: 10px;
      background-color: #9eea6a;
      &::after {
        right: -12px;
        border-left: 6px solid #9eea6a;
        border-right: 6px solid transparent;
      }
    }  
  }
  .otherMessage > div {
    flex-direction: row-reverse;
    .name {
      margin: 0 0 2px 10px;
    }
    .message {
      margin-left: 10px;
      background-color: #fff;
      &::after {
        left: -12px;
        border-left: 6px solid transparent;
        border-right: 6px solid #fff;
      }
    }  
  }
}
// 发送消息区
.send-message {
  position: relative;
  flex: 1;
  padding: 10px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .actions {
    position: relative;
    display: flex;
    align-items: center;
    .iconfont {
      cursor: pointer;
      font-size: 20px;
    }
    .iconfont:not(:last-child) {
      margin-right: 10px;
    }
    .emoji-box {
      position: absolute;
      display: flex;
      flex-wrap: wrap;
      width: 290px;
      height: 210px;
      overflow: auto;
      bottom: 30px;
      background-color: #fff;
      border: 1px solid #cccccc;
      outline: none;
      span {
        padding: 5px;
        font-size: 22px;
        cursor: pointer;
      }
    }
    .send-img {
      input[type='file'] {
        display: none;
      }
    }
  }
  .input-container {
    flex: 1;
    border: none;
    margin: 5px 0 10px;
  }
  // 去掉可编辑div聚焦时的黑色边框
  [contenteditable]:focus {
    outline: none;
  }
  .send-button {
    display: flex;
    justify-content: flex-end;
    button {
      padding: 5px 10px;
      font-size: 14px;
      border-radius: 3px;
    }
  }
}
/** 自定义滚动条 */
.scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scrollbar::-webkit-scrollbar-corner {
  background-color: transparent;
}
.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(144, 147, 153, 0.3);
}
.scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
</style>
