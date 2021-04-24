import React from "react";
import { connect } from "react-redux";
import {
  follow,
  setCurrentPage,
  setTotalUsersCount,
  setUsers,
  toggleFollowingInProgress,
  toggleIsFetching,
  unFollow,
} from "../../redux/usersPageReducer";
import { Users } from "./Users";
import { Preloader } from "../common/Preloader/Preloader";
import { RootReduxState } from "../../redux/store";
import { usersAPI } from "../../api/api";
import {UsersPageType, UserType} from "../../redux/types";

type MSTPropsType = {
  userPage: UsersPageType;
  pageSize: number;
  totalUsersCount: number;
  currentPage: 1 | number;
  isFetching: boolean;
  followingInProgress: Array<number>;
};

type MDTPropsType = {
  follow: (userId: number) => void;
  unFollow: (userId: number) => void;
  setUsers: (user: Array<UserType>) => void;
  setCurrentPage: (currentPage: number) => void;
  setTotalUsersCount: (totalCount: number) => void;
  toggleIsFetching: (isFetching: boolean) => void;
  toggleFollowingInProgress: (isFetching: boolean, userId: number) => void;
};

export type UsersPropsType = MSTPropsType & MDTPropsType;

class UsersContainer extends React.Component<UsersPropsType> {
  componentDidMount() {
    this.props.toggleIsFetching(true);

    usersAPI
      .getUsers(this.props.currentPage, this.props.pageSize)
      .then((data) => {
        this.props.toggleIsFetching(false);
        this.props.setUsers(data.items);
        this.props.setTotalUsersCount(data.totalCount);
      });
  }

  onPageChanged = (pageNumber: number) => {
    this.props.setCurrentPage(pageNumber);
    this.props.toggleIsFetching(true);

    usersAPI.getUsers(pageNumber, this.props.pageSize).then((data) => {
      this.props.toggleIsFetching(false);
      this.props.setUsers(data.items);
    });
  };

  render() {
    return (
      <>
        {this.props.userPage.isFetching ? <Preloader /> : null}
        <Users
          totalUsersCount={this.props.totalUsersCount}
          pageSize={this.props.pageSize}
          currentPage={this.props.currentPage}
          users={this.props.userPage.users}
          follow={this.props.follow}
          unFollow={this.props.unFollow}
          followingInProgress={this.props.followingInProgress}
          onPageChanged={this.onPageChanged}
          toggleFollowingInProgress={this.props.toggleFollowingInProgress}
        />
      </>
    );
  }
}

const mapStateToProps = (state: RootReduxState): MSTPropsType => {
  return {
    userPage: state.usersPage,
    pageSize: state.usersPage.pageSize,
    totalUsersCount: state.usersPage.totalUsersCount,
    currentPage: state.usersPage.currentPage,
    isFetching: state.usersPage.isFetching,
    followingInProgress: state.usersPage.followingInProgress,
  };
};

export default connect(mapStateToProps, {
  follow,
  unFollow,
  setUsers,
  setCurrentPage,
  setTotalUsersCount,
  toggleIsFetching,
  toggleFollowingInProgress,
})(UsersContainer);
