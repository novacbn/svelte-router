import type {URLPatternResult} from "urlpattern-polyfill/dist/types";

export type IContext = Record<string, any>;

export type IServices = Record<string, any>;

export type IProps = Record<string, any>;

interface ILoadContext<Context extends IContext> {
    context: Context;
}

interface ILoadProps<Props extends IProps> {
    props: Props;
}

interface ILoadServices<Services extends IServices> {
    services: Services;
}

interface ILoadUntypedInput {
    pattern: URLPatternResult;

    url: URL;
}

interface ILoadUntypedOutput {
    redirect?: string;
}

export type ILoadInput<Services extends IServices | undefined = undefined> = ILoadUntypedInput &
    (Services extends IServices ? ILoadServices<Services> : {});

export type ILoadOutput<
    Context extends IContext | undefined = undefined,
    Props extends IContext | undefined = undefined
> = ILoadUntypedOutput &
    (Context extends IContext ? ILoadContext<Context> : {}) &
    (Props extends IProps ? ILoadProps<Props> : {});

export type ILoadCallback<
    Services extends IServices | undefined = undefined,
    Context extends IContext | undefined = undefined,
    Props extends IContext | undefined = undefined
> = (
    input: ILoadInput<Services>
) => ILoadOutput<Context, Props> | void | Promise<ILoadOutput<Context, Props> | void>;

export function define_load<
    Services extends IServices | undefined = undefined,
    Context extends IContext | undefined = undefined,
    Props extends IProps | undefined = undefined
>(callback: ILoadCallback<Services, Context, Props>): ILoadCallback<Services, Context, Props> {
    return callback;
}
