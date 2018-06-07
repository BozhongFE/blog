// 目标（天气预报）
class WeatherSubject {
  constructor() {
    this.observerList = [];
  }
  subscribeTV(observer) {
    this.observerList.push(observer);
  }
  unsubscribeTV(observer) {
    // ...
  }
  // fire event
  notify(data) {
    for (const observer of this.observerList) {
      observer.watcher(data);
    }
  }
}

// 观察者（各大电视台）
class TVObserver {
  constructor(name) {
    this.name = name;
  }
  // subscribe
  watcher(weather) {
    console.log(this.name, weather);
  }
}

const weather = new WeatherSubject();

const tv1 = new TVObserver('广州电视台');
weather.subscribeTV(tv1);

const tv2 = new TVObserver('北京电视台');
weather.subscribeTV(tv2);

// 第一天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆珠海');
}, 1000);

// 第二天
setTimeout(() => {
  weather.notify('广东台风来了，即将登陆广州');
}, 3000);

/*
广州电视台 广东台风来了，即将登陆珠海
北京电视台 广东台风来了，即将登陆珠海

广州电视台 广东台风来了，即将登陆广州
北京电视台 广东台风来了，即将登陆广州
*/