export default { title: 'Consumer/Buttons' };

export const Bordered = {
    render: () => <button style={{ border: '2px solid transparent' }}>Bordered button</button>,
};

export const Borderless = {
    render: () => <button style={{ border: 0 }}>Borderless button</button>,
};
