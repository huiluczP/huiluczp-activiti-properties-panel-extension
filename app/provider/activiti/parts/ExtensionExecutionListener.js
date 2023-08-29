import { TextFieldEntry, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';

import { useService } from 'bpmn-js-properties-panel';

// 构建list中的一层，包括event设置和delegateExpression设置
export default function ExtensionExecutionListener(props) {

    const {
        idPrefix,
        element,
        executionListener
    } = props;

    const entries = [
        {
            // idPrefix是外部传进来的element id，所以增加一个后缀来进行区分
            id: idPrefix + '-event',
            component: event,
            isEdited: isSelectEntryEdited, // 使用下拉框决定event的值
            idPrefix,
            executionListener
        },
        {
            id: idPrefix + '-delegateExpression',
            component: delegateExpression,
            idPrefix,
            executionListener
        }
    ];

    return entries;
}

// 设置event属性
function event(props) {

    // 要注意的是executionListener，需要它来进行属性的修改 
    const {
        idPrefix,
        element,
        executionListener
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: executionListener,
            properties: {
                event: value
            }
        });
    };

    const getValue = (executionListener) => {
        return executionListener.event;
    };

    // 设置选项
    const getOptions = () => {
        return [
            {label: 'start', value: 'start'},
            {label: 'middle', value: 'middle'},
            {label: 'end', value: 'end'},
          ];
    }

    // 也可使用html拼接
    return SelectEntry({
        element: executionListener,
        id: idPrefix + '-event',
        label: translate('event'),
        getValue: getValue,
        setValue: setValue,
        getOptions: getOptions,
        debounce: debounce
    });
}

// 设置delegateExpression属性
function delegateExpression(props) {
    const {
        idPrefix,
        element,
        executionListener
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const setValue = (value) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: executionListener,
            properties: {
                delegateExpression: value
            }
        });
    };

    // exectionListener获取属性
    const getValue = (executionListener) => {
        return executionListener.delegateExpression;
    };

    // 也可使用html拼接
    return TextFieldEntry({
        element: executionListener,
        id: idPrefix + '-delegateExpression',
        label: translate('delegateExpression'),
        getValue,
        setValue,
        debounce
    });
}