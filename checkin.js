
const axios = require('axios');
const urlencode = require('urlencode');

function getDaysBetween() {
    startDateStr = '2020-10-25'
    endDateStr = new Date().toLocaleDateString('fr-CA');
    var startDate = Date.parse(startDateStr);
    var endDate = Date.parse(endDateStr);
    if (startDate > endDate) {
        return 0;
    }
    if (startDate == endDate) {
        return 1;
    }
    var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    return days;
}

const getMessage = async () => {
    return axios({
        method: 'get',
        url: 'https://wis.qq.com/weather/common?source=pc&province=%E5%B9%BF%E4%B8%9C%E7%9C%81&city=%E5%B9%BF%E5%B7%9E%E5%B8%82&weather_type=observe|forecast_24h|tips|index|alarm',
    });
}

const dealMessage = async () => {
    const rj = (await getMessage())?.data?.data;
    console.log("rj:", rj);
    const comfort_detail = rj['index']['comfort']['detail']
    const make_up = rj['index']['makeup']['detail']
    const sunscreen = rj['index']['sunscreen']['detail']
    const forecast_24h = rj['forecast_24h']['1']
    const day_weather = forecast_24h['day_weather']
    const day_wind_direction = forecast_24h['day_wind_direction']
    const max_degree = forecast_24h['max_degree']
    const min_degree = forecast_24h['min_degree']
    const time = forecast_24h['time']
    const observe = rj['tips']['observe']['0']
    const day_span = getDaysBetween()
    const message = `(๑> ₃ <) 小小艺娜酱，今天是${time}，╰(￣▽￣)╭是我们在一起的第${day_span}天。\n今日天气：${day_weather}，${min_degree}°C-${max_degree}°C，${day_wind_direction}。\n${comfort_detail}\n${make_up}\n${sunscreen}\n每日一句：${observe}\n——以上信息来自爱你的小智智(๑•̀ㅂ•́)و✧`;
    console.log("message:", message);
    return message;
}

const sendMessage = async () => {
    let desp = await dealMessage();
    if (desp) {
        const key = process.env.SCKEY
        console.log(desp);
        console.log("--------------------")
        const title = '每日短信'
        try {
            const code = (await axios({
                method: 'post',
                url: `https://sctapi.ftqq.com/${key}.send?title=${urlencode(title)}&desp=${urlencode(desp)}`,
            }))?.data?.code
            if (code === 0) {
                console.log('发送成功');
            }
        } catch (e) {
            console.log(e)
        }
    }
}

sendMessage().then();