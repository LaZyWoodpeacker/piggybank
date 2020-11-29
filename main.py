import matplotlib
import matplotlib.pyplot as plt
import numpy as np


def calc(cost, rate, term, first):
    result = dict()
    rate = rate / 100
    toprate = 1+rate
    result['first'] = first
    # result['rows'] = (cost - first) * rate * (1 / ((1 + rate) ** term - 1))
    result['rows'] = ((cost-first*toprate)*rate*(1/(((1 + rate) ** term) - 1)))
    result['payUp'] = result['rows']
    result['count'] = first
    result['percentSumm'] = 0
    result['paySumm'] = first + (result['payUp'] * term)
    result['payments'] = []
    for i in range(term):
        percents = result['count'] * rate
        curconto = result['count']
        result['percentSumm'] += percents
        result['count'] += percents
        result['count'] += result['payUp']
        month = {'curconto': curconto, 'count': result['count'],
                 'month': i+1, 'percents': percents, 'payUp': result['payUp']}
        result['payments'].append(month)
    return result


cost = 15000000
rate = 10
term = 10
first = 100

point = rate/100
testVklad = 50

data = calc(cost, rate, term, first)


def func(x):
    if(x > 0):
        rate = 10/100
        toprate = 1+rate
        vkl = (cost*rate*(1/((toprate**term)-1)))
        coof = ((1+point)**(x-1))
        ank = (toprate**term)/(toprate**term-1)
        result = (vkl*x)*coof+(first*(1+point))
        # result = ((first+testVklad*(x-1))*coof) + testVklad
    else:
        result = first
    return result

# ank = (cost*rate)/(1-(toprate**-term))
# ank = (((toprate**term)-1)/rate)
# ank = (rate*(toprate**term))/((toprate**term)-1)


def funk2(cost, first, rate, term):
    rate = rate/100
    toprate = 1+rate

    def getPayment(c):
        return (c*rate*(1/((toprate**term)-1)))

    def getMitFirst(c):
        return (c*rate*(1/((toprate**term)-1)))+(first*(toprate**term))

    def getS(cost):
        return first*toprate**term

    # result = getMitFirst(cost)
    result = getMitFirst(cost)
    return 'cost: {} first: {} rate: {} term: {} result: {}'.format(cost, first, rate, term, result)


x = np.arange(0, term+1, 1)
y = list(map(func, x))

maxY = np.max(y)
# print(x)
# print(y)


def drawBars(months):
    plt.bar(0, first, .3)
    for month in months:
        plt.bar(month['month'], month['count'], .3,
                color='green')


def drawBarsPercents(months):
    for month in months:
        plt.bar(month['month'], month['count'] -
                month['percents'], .3, color='red')


def drawBarsFirst(months):
    for month in months:
        plt.bar(month['month'], data['first'], .3, color='blue')


fig, ax = plt.subplots()


ax.set_ylabel('Из формулы')
ax.set_yticks(list(map(lambda x: x['count'], data['payments'])))

for num in list(map(lambda x: x['count'], data['payments'])):
    ax.axhline(num, color='red')


for num in list(y):
    ax.axhline(num, color='green')

ax2 = ax.secondary_yaxis('right')
ax2.set_yticks(y)


def getByidx(idx):
    return round(y[idx-1])


ax3 = ax.secondary_xaxis('top')
ax3.set_xlabel('cost:{0} percent:{1} testVklad:{2} term:{3} first:{4}'.format(
    cost, rate, testVklad, term, first))
ax3.set_xticks([])

ax.plot(x, y)

ax.set_xlabel('months')
ax2.set_ylabel('predict')
drawBars(data['payments'])
drawBarsPercents(data['payments'])
drawBarsFirst(data['payments'])
fig.savefig('img.png', dpi=150)


def trank(sum):
    return sum


print(data['percentSumm'])
print(data['payUp'])
print(data['paySumm'])


print(funk2(cost, first, rate, term))
print(funk2(15000000, first, rate, 10))
