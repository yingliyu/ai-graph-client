import { useEffect, useState, useRef } from 'react';

function useCallbackState(od: any) {
    const cbRef = useRef();
    const [data, setData] = useState(od);

    // useEffect(() => {
    //     cbRef?.current && cbRef?.current(data);
    // }, [data]);

    return [
        data,
        function (d: any, callback?: any) {
            cbRef.current = callback;
            setData(d);
        }
    ];
}

export { useCallbackState };
