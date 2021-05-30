import { Button } from 'vant'
console.log(Button)

function scopeGlboal() {
 let pg = 'scopeGlobal pg'
}

function scopeA() {
  let pa = 'scopeA pa'
  pg
}

function scopeB() {
  let pb = 'scopeB pb'
}
