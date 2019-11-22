import React from 'react';
import { Button } from 'deriv-components';
import './ads.scss';

class Ads extends React.Component {
    state = {
        ads_list: [],
    }

    componentDidMount() {
        this.setState({
            ads_list: [
                ...this.state.ads_list,
                {
                    currency: 'USD',
                },
                {
                    currency: 'BTC',
                },
            ],
        });
    }

    render() {
        const { ads_list } = this.state;
        return (
            <div className="ads">
                <ul className="ads__list-wrapper">
                    {ads_list.map(ads => <li key={ads.currency} className="ads__list">
                        <Button primary>{ads.currency}</Button>
                    </li>
                    )}
                </ul>
            </div>
        );
    }
}
 
export default Ads;
