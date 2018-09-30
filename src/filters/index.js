export function adminTypeFilter(v) {
  switch (v) {
    case v === 0 || v === 2:
      return '主管理员'
    case v === 1 || v === 3:
      return '子管理员'
  }
}

export function statusFliter(v) {
  switch (v) {
    case 1:
      return '待审核'
    case 2:
      return '待签名'
    case 3:
      return '拒绝'
    case 4:
      return '正在提币'
    case 5:
      return '提币成功'
    case 6:
      return '失败'
    default:
      return '失败！'
  }
}
