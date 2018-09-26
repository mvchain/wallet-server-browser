export function adminTypeFilter(v) {
  switch (v) {
    case v === 0 || v === 2:
      return '主管理员'
    case v === 1 || v === 3:
      return '子管理员'
  }
}

