____

#Data Gathering
____

## History 

#### Facts:
The facts below are related to tech, e-filing, and the environment.

1. In 1981, the first laptop was publically available for purchase, which weighed over 20lbs and had a 5 inch screen. [source](https://en.wikipedia.org/wiki/Laptop)
1. The internet became widely availble in the late 1980s [source](http://www.internetsociety.org/internet/what-internet/history-internet/brief-history-internet#Transition).
1. By 1990 e-filing was available nationwide. [source](https://www.irs.gov/uac/irs-e-file-a-history).
1. Less than 4% of tax returns were e-filed in 1990. [source](https://www.irs.gov/pub/irs-soi/90inar.pdf).
1. In the late 1990s, the US government set a goal for 80% of taxes being e-filed. [source](https://www.irs.gov/uac/starting-in-2011-many-paid-preparers-must-e-file-federal-income-tax-returns-for-individuals-estates-and-trusts)
1. In 2009, the acting head of the EPA authored a declaration that CO<sub>2</sub> threatens the public health and welfare of current and future generations. [source](https://www.epa.gov/climatechange/endangerment-and-cause-or-contribute-findings-greenhouse-gases-under-section-202a)
1. By 2011, the US government enacted legislation that requires paid tax preparers to e-file. [source](https://www.irs.gov/uac/starting-in-2011-many-paid-preparers-must-e-file-federal-income-tax-returns-for-individuals-estates-and-trusts) 
1. In 2016, over 90% of tax returns are e-filed. [source](https://www.efile.com/efile-tax-return-direct-deposit-statistics/)
1. Laptops weigh about 3lbs and have 15inch screens. [source](http://www.apple.com/macbook-pro/specs/)
1. In 2017, the acting head of the EPA made a declaration that CO<sub>2</sub> is not a primary contributor to global warming [source](https://www.nytimes.com/2017/03/09/us/politics/epa-scott-pruitt-global-warming.html)
1. Further historical facts from e-filing from the IRS are available [here](https://www.irs.gov/uac/irs-e-file-a-history)

#### Stats:  
* The following information is reported by the IRS :
    1. The total number of tax returns filed in 1990 [source](https://www.irs.gov/pub/irs-soi/90inar.pdf):
        * 113,717,138 returns filed
    1. The total number of tax returns filed in 2000 [source](https://www.irs.gov/uac/soi-tax-stats-individual-statistical-tables-by-size-of-adjusted-gross-income)
        * 129,373,500 returns filed
    1. The total number of tax returns filed in 2010 [source1](https://www.irs.gov/uac/2017-and-prior-year-filing-season-statistics) [source2](https://www.irs.gov/uac/2010-filing-season-statistics):
        * 142,449,000 returns filed
    1. The total number of tax returns filed in 2016 [source1](https://www.irs.gov/uac/2017-and-prior-year-filing-season-statistics)[source2](https://www.irs.gov/uac/newsroom/filing-season-statistics-for-the-week-ending-december-30-2016):
        * 152,544,000
    1. The total number of tax returns filed in 2025 (used 2020's total primary return figure) [source](https://www.irs.gov/pub/irs-soi/p6292.pdf) 
        * 229,259,400

* The following information is a rough approximation of e-filing percentages. [source](https://www.efile.com/efile-tax-return-direct-deposit-statistics/):
    * 1990's:  4% - 25% total returns e-file
    * 2000's: 30% - 70% total returns e-file
    * 2010's: 70% - 90% total returns e-file
    * 2016: 90% total returns e-file
    * 2025: 99.9%
  
## Energy


#### Assumptions:
The information below lays out the assumptions used to build an approximation for how much CO<sub>2</sub> is used to paper file versus efile. 
* The International Post Corporation reported in their [2016 sustainability report](https://www.ipc.be/en/knowledge-centre/sustainability/sustainability-report) that mailing 1 letter in 2015 required 37.2g of CO<sub>2</sub>. We use this number as the lower bound for the carbon used to paper file taxes.   
    
* The total number of hours it takes to file a tax return is assumed to be 9 hours for 70% of returns and 22 hours for the remaining 30% [source](https://www.irs.gov/instructions/i1040a/ar03.html)  

* On average, electricity sources emit 1.222lbs CO2 per kWh (0.0005925 metric tons CO2 per kWh) [source](https://carbonfund.org/how-we-calculate/), which is assumed to be constant across all years.  

* Laptops are assumed to require 70 watts the following instantaneous watts [source1](https://support.apple.com/en-us/HT201700) [source2](https://support.apple.com/en-us/HT201796)  
    
* Laptops are assumed to be responsible for all e-filing. [NO SOURCE]


## Formulas
* The equation for calculating the total CO<sub>2</sub> from paper filings:

\begin{equation}
paperCO_2 =  (number\ of\ returns\ in\ the\ year) * (\%paper\ filing) * (CO_2\ per\ mailed\ letter) 
\end{equation}  

* The equation(s) for calculating the total CO<sub>2</sub> from e-filings included the assumption for the different time taken to prepare business and non-business tax returns: 

\begin{equation}
efile30CO_2 = (number\ of\ returns\ in\ this\ year) * (\%efile\ filing) * (30\%) * (9\ hrs\ to\ prepare\ return) * (laptop\ watts) * (CO_2\ conversion)  
\end{equation} 

\begin{equation}
efile70CO_2 = (number\ of\ returns\ in\ this\ year) * (\%efile\ filing) * (70\%) * (22\ hrs\ to\ prepare\ return) * (laptop\ watts) * (CO_2\ conversion)  
\end{equation}

\begin{equation}
efileCO_2 = efile30CO_2 + efile70CO_2  
\end{equation}
