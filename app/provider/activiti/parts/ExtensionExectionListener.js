import { TextFieldEntry } from '@bpmn-io/properties-panel';

import { useService } from 'bpmn-js-properties-panel';

// 构建list中的一层，包括event设置和delegateExpression设置
export default function ExtensionExectionListener(props) {

    const {
        idPrefix,
        element,
        parameter
    } = props;

    const entries = [
        {
            // idPrefix是外部传进来的element id，所以增加一个后缀来进行区分
            id: idPrefix + '-event',
            component: event,
            idPrefix,
            parameter
        },
        {
            id: idPrefix + '-delegateExpression',
            component: delegateExpression,
            idPrefix,
            parameter
        }
    ];

    return entries;
}

// 设置event属性
function event(props) {

    // 要注意的是paramter，需要它来进行属性的修改 
    const {
        idPrefix,
        element,
        parameter
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: parameter,
            properties: {
                event: value
            }
        });
    };

    const getValue = (parameter) => {
        return parameter.event;
    };

    // 也可使用html拼接
    return TextFieldEntry({
        element: parameter,
        id: idPrefix + '-event',
        label: translate('event'),
        getValue,
        setValue,
        debounce
    });
}

// 设置delegateExpression属性
function delegateExpression(props) {
    const {
        idPrefix,
        element,
        parameter
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: parameter,
            properties: {
                delegateExpression: value
            }
        });
    };

    // parameter获取属性
    const getValue = (parameter) => {
        return parameter.delegateExpression;
    };

    // 也可使用html拼接
    return TextFieldEntry({
        element: parameter,
        id: idPrefix + '-delegateExpression',
        label: translate('delegateExpression'),
        getValue,
        setValue,
        debounce
    });
}