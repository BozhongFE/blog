class WeatherPublish {
  // publish event
  notify(weather, dispatchHandler) {
    dispatchHandler(weather);
  }
}

class TVDispatchCenter {
  constructor() {
    this.tv = {};
  }
  subscribe(name, handler) {
    this.tv[name] = this.tv[name] || [];
    this.tv[name].push(handler);
  }
  // fire event
  notify(data) {
    for (const name in this.tv) {
      const handlers = this.tv[name];
      for (const handler of handlers) {
        handler(name, data);
      }
    }
  }
}

const weather = new WeatherPublish();

const dispatchCenter = new TVDispatchCenter();

dispatchCenter.subscribe('广州电视台', (name, weather) => {
  console.log(name, weather, '广州提醒');
});

dispatchCenter.subscribe('北京电视台', (name, weather) => {
  console.log(name, weather, '北京提醒');
});

// 第一天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆珠海', (weather) => {
    dispatchCenter.notify(weather);
  });
}, 1000);

// 第二天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆广州', (weather) => {
    dispatchCenter.notify(weather);
  });
}, 3000);

/*
广州电视台 广东台风来了，即将登陆珠海 广州提醒
北京电视台 广东台风来了，即将登陆珠海 北京提醒

广州电视台 广东台风来了，即将登陆广州 广州提醒
北京电视台 广东台风来了，即将登陆广州 北京提醒
*/
// https://www.zhihu.com/question/23486749
// https://www.cnblogs.com/lovesong/p/5272752.html