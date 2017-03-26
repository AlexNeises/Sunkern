socket = io()

socket.on 'temperature', (data) ->
    i = 0
    temp = []
    time = []
    while i < data.data.length
        temp.push (Math.round(((+data.data[i].temp2mavg * (9 / 5)) + 32) * 10) / 10).toFixed(1)
        time.push moment(data.data[i].timestamp).format('MMM Do, h:mm A')
        i++

    ctx = $('#ctx')

    data =
        labels: time
        datasets: [
            {
                label: '10 Day Average Temperature'
                backgroundColor: 'pink'
                borderColor: 'red'
                lineTension: 0.15
                borderWidth: 1
                pointRadius: 0
                data: temp
            }
        ]

    lineChart = new Chart ctx,
        type: 'line'
        data: data