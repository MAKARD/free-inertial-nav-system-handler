import * as PropTypes from "prop-types";

interface Types {
    [key: string]: PropTypes.Validator<any>;
}

interface Props {
    [key: string]: any;
}

export class TypedClass {
    constructor(props: Props, propTypes: Types) {
        this.checkTypes(props, propTypes);
    }

    protected checkTypes(props: Props, propTypes: Types): void | never {
        (PropTypes as any).checkPropTypes(propTypes, props, "", "TypedClassChild", () => {
            throw new Error("Invalid passed props");
        });
    }
}
