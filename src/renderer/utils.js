/**
 * type是消息类型，1文本，2系统话术，3图片
 * content 是消息内容
 * fromId 消息发送方
 * toId 消息接收方
 */
export function msgBody(type, content, fromId, toId) {
  return {
    type,
    content,
    fromId,
    toId,
    id: new Date().getTime(),
  }
}