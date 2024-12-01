export type userInfo = {
  username: string
  avatar: number
}

export type messageType = {
  msg: string
  type: 0 | 1 | 2  // 0 系统消息  1 自己发的  2 别人发的

  // 当前版本表情是字符串，可以直接拼在文本后面，2 这个值暂时用不上  
  flag: 0 | 1 | 2  // 0 文字消息  1 图片  2 表情 
  username: string
  avatar: number
}