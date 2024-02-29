import React, { useState, useEffect } from 'react';
import { ReactECharts } from "../Echarts/ReactECharts";
import ChoiceGroup from "./ChoiceGroup";


type CurrencyRange = {
    min: number;
    max: number;
    interval: number
};

const DataComponent = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState<string>('USD');
    const [allData, setAllData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [averageValue, setAverageValue] = useState<number>(0);

    const currencyRanges: Record<string, CurrencyRange> = {
        USD: { min: 72, max: 84, interval: 3},
        EUR: { min: 86, max: 94, interval: 2},
        CNY: { min: 18, max: 26, interval: 2}
    };
    const currentCurrencyRange = currencyRanges[currency];

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/data');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const responseData = await response.json();
            setAllData(responseData || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = allData.filter((item) => {
            let selectedCurrencyEnglish;
            switch (currency) {
                case 'USD':
                    selectedCurrencyEnglish = 'Курс доллара';
                    break;
                case 'EUR':
                    selectedCurrencyEnglish = 'Курс евро';
                    break;
                case 'CNY':
                    selectedCurrencyEnglish = 'Курс юаня';
                    break;
                default:
                    selectedCurrencyEnglish = '';
            }
            return item.indicator === selectedCurrencyEnglish;
        });
        setFilteredData(filtered);
    }, [currency, allData]);

    const calculateAverage = (data: { value: number }[]) => {
        if (data.length === 0) return 0;
        const sum = data.reduce((acc: number, item: { value: number }) => acc + item.value, 0);
        return sum / data.length;
    };

    useEffect(() => {
        if (filteredData.length > 0) {
            const xAxisData = filteredData.map(item => item.month);
            const yAxisData = filteredData.map(item => item.value);

            const option = {
                xAxis: {
                    type: 'category',
                    data: xAxisData,
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                    min: currentCurrencyRange.min,
                    max: currentCurrencyRange.max,
                    interval: currentCurrencyRange.interval,
                },
                grid: {
                    top: '10%',
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                    containLabel: true,
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderWidth: 1,
                    borderColor: '#ccc',
                },
                series: [{
                    data: yAxisData,
                    type: 'line',
                    lineStyle: {
                        color: '#F38B00'
                    },
                    itemStyle: {
                        color: '#F38B00'
                    }
                }],
                tooltip: {
                    trigger: 'axis',
                }
            };
            setChartData(option);

            const average = calculateAverage(filteredData);
            setAverageValue(average);
        }
    }, [filteredData]);

    const handleCurrencySelect = (selectedCurrency: string) => {
        setCurrency(selectedCurrency);
    };


    return (
        <div style={{ width: '1200px', height: '400px' }}>
            <div style={{ width: '208px', height: '30px', paddingRight: '13px', marginTop: '20px', fontWeight: 'bold', fontSize: '20px' }}>
                {currency === 'USD' && <div>КУРС ДОЛЛАРА, &#36;/₽</div>}
                {currency === 'EUR' && <div>КУРС ЕВРО, &#8364;/₽</div>}
                {currency === 'CNY' && <div>КУРС ЮАНЯ, &#165; /₽</div>}
            </div>
            <div style={{paddingLeft: '980px', marginTop: '-30px'}}>
                <ChoiceGroup  onChange={handleCurrencySelect} />
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ReactECharts option={chartData}/>
            )}
            <div>
                <p style={{ width: '156px', height: '27px', paddingLeft: '900px', marginTop: "-180px", fontWeight: 'normal', fontSize: '16px', color: "#667985"}}>Среднее за период:</p>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <p style={{ paddingLeft: '910px', marginTop: "1px", fontWeight: 'regular', fontSize: '48px', color: "#F38B00" }}>{averageValue}</p>
                    <p style={{ paddingLeft: '10px', marginTop: "1px", fontWeight: 'normal', fontSize: '30px', color: "#667985" }}>₽</p>
                </div>
            </div>
        </div>
    );
};

export default DataComponent;
