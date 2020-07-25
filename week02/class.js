Class 动物 {
  constructor(options) {
    this.名字 = options.名字
  }
}

Class 人 extends 动物 {
  constructor(options) {
     super(options);
     this.血量 = options.血量 || 100
     this.受伤程度 = options.受伤程度 || {
       '狗咬': 30
     }
     
  }

  被外界影响(外界影响) {
    if (外界影响 === '狗咬') {
      this.受伤害(外界影响)
    }
  }

  受伤害(伤害类型) {
    if (伤害类型 === '狗咬') {
      this.血量 = this.血量 - this.受伤程度[伤害类型]
    }
  }
}

Class 狗 extends 动物 {
  constructor(options) {
     super(options);
  }

  咬(对象) {
    对象.被外界影响('狗咬')
  }

}

const 一只狗 = new 狗('一只狗')
const 一个人 = new 人('一个人')

一只狗.咬(一个人)