import React, { useState } from 'react';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { presetGpnDefault, Theme } from '@consta/uikit/Theme';

interface CurrencyChoiceProps {
  onChange: (value: string) => void;
}

const CurrencyChoice: React.FC<CurrencyChoiceProps> = (props) => {
  const [value, setValue] = useState<string>('USD');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    props.onChange(newValue);
  };

  return (
    <Theme className="choice_group" preset={presetGpnDefault}>
      <ChoiceGroup
        value={value}
        onChange={handleChange}
        items={['USD', 'EUR', 'CNY']}
        getItemLabel={(item) => item}
        view="primary"
        form="default"
        size="xs"
        width="default"
        multiple={false}
        name="currency"
      />
    </Theme>
  );
};

export default CurrencyChoice;
