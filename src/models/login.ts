import { Model } from 'dva';
import router from 'umi/router';
import { setSign } from '@/utils/actAuth';

const resetNamespace: string[] = ['user'];
const defaultState = {
  scope: null,
  status: false, // @TODO
  nickname: 'NULL',
  avatar: '',
};

export type LoginState = Readonly<typeof defaultState> & {
  scope: Array<string | number>;
};

export interface LoginModel extends Model {
  state: LoginState;
}

const model: LoginModel = {
  namespace: 'login',
  state: defaultState,
  effects: {
    *login({ payload }, { call, put }) {
      const { scope } = yield call(); // @TODO
      yield put({
        type: 'setState',
        payload: {
          scope,
          status: true,
        },
      });
    },
    *logout(_, { put }) {
      setSign(null);
      yield put({
        type: 'resetNamespace',
      });
      yield router.push('/user/login');
    },
    *register({ payload }, { call, put }) {
      // @TODO
    },
    *resetNamespace(_, { put }) {
      yield put({
        type: 'resetState',
      });
      for (const namespace of resetNamespace) {
        yield put({
          type: `${namespace}/resetState`,
        });
      }
    },
  },
  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetState() {
      return defaultState;
    },
  },
};

export default model;
