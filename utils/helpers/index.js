export function mapSyncModel(data = 'model', prop = 'value') {
  return {
    [prop](propValue) {
      this[data] = propValue
    },
    [data](dataValue) {
      if (prop === 'value') this.$emit('input', dataValue)
      else this.$emit(`update:${prop}`, dataValue)
    },
  }
}

function getValue(src, key) {
  const paths = key.split('.')

  if (!src) return

  if (paths.length === 1) {
    return src[paths[0]]
  } else return getValue(src[paths[0]], paths.slice(1).join('.'))
}

export function mapToStore(arg) {
  let keys
  if (Array.isArray(arg)) keys = arg.map((e) => [e, e])
  else keys = Object.entries(arg)

  return keys.reduce((obj, [key, path]) => {
    obj[key] = {
      get() {
        return getValue(this.$store.state, path)
      },
      set(value) {
        if (path.includes('.'))
          this.$store.commit(path.replace('.', '/'), value)
        else this.$store.commit(path, value)
      },
    }

    return obj
  }, {})
}

function assignValue(src, key, value) {
  const paths = key.split('.')

  if (!src) return

  if (paths.length === 1) src[paths[0]] = value
  else assignValue(src[paths[0]], paths.slice(1).join('.'), value)
}

export function makeMutations(...arr) {
  return arr.reduce((obj, key) => {
    obj[key] = (state, value) => assignValue(state, key, value)

    return obj
  }, {})
}

export function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

export function debounce(func, wait) {
  let timeout
  return function (...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(context, args), wait)
  }
}

export function asyncTimeOut(timeout) {
  if (timeout < 1) return

  return new Promise((resolve) => setTimeout(() => resolve(), timeout))
}
