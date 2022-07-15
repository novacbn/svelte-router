import type {IContext, ILoadCallback, IProps} from "./router";

export function define_load<Context extends IContext = never, Props extends IProps = never>(
    callback: ILoadCallback<Context, Props>
): ILoadCallback<Context, Props> {
    return callback;
}
