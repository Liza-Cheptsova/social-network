import React from "react";
import styles from "./Users.module.css";
import { NavLink } from "react-router-dom";
import { usersAPI } from "../../api/api";
import userPhoto from "../../assets/images/ava.jpg";
import { UserType } from "../../redux/types";

type UsersPageType = {
  totalUsersCount: number;
  pageSize: number;
  currentPage: number;
  onPageChanged: (pageNumber: number) => void;
  users: UserType[];
  follow: (userId: number) => void;
  unFollow: (userId: number) => void;
  followingInProgress: Array<number>;
  toggleFollowingInProgress: (isFetching: boolean, userId: number) => void;
};

export const Users = (props: UsersPageType) => {
  let pageCount = Math.ceil(props.totalUsersCount / props.pageSize);
  let pages = [];

  if (pageCount > 20) {
    if (props.currentPage > 5) {
      for (let i = props.currentPage - 9; i <= props.currentPage + 9; i++) {
        pages.push(i);
        if (i == pageCount) break;
      }
    } else {
      for (let i = 1; i <= 20; i++) {
        pages.push(i);
        if (i == pageCount) break;
      }
    }
  } else {
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
  }

  return (
    <div>
      <div className={styles.pagination}>
        {pages.map((p) => {
          return (
            <span
              key={p}
              className={props.currentPage === p ? styles.selectedPage : ""}
              onClick={() => {
                props.onPageChanged(p);
              }}
            >
              {p}
            </span>
          );
        })}
      </div>

      <div className={styles.users_container}>
        {props.users.map((u) => (
          <div key={u.id} className={styles.user_wrap}>
            <div className={styles.ava_title}>
              <div className={styles.user_avatar}>
                <NavLink to={"/profile/" + u.id}>
                  <img
                    className={styles.avatar}
                    src={u.photos.small != null ? u.photos.small : userPhoto}
                    alt="smile"
                  />
                </NavLink>
              </div>
              <p>{u.name}</p>
            </div>

            <div>
              {u.followed ? (
                <button
                  className={styles.btn}
                  disabled={props.followingInProgress.some((id) => id === u.id)}
                  onClick={() => {
                    props.toggleFollowingInProgress(true, u.id);
                    usersAPI.unFollow(u.id).then((response) => {
                      if (response.data.resultCode === 0) {
                        props.unFollow(u.id);
                      }
                      props.toggleFollowingInProgress(false, u.id);
                    });
                  }}
                >
                  UnFollow
                </button>
              ) : (
                <button
                  className={styles.btn}
                  disabled={props.followingInProgress.some((id) => id === u.id)}
                  onClick={() => {
                    props.toggleFollowingInProgress(true, u.id);
                    usersAPI.follow(u.id).then((response) => {
                      if (response.data.resultCode === 0) {
                        props.follow(u.id);
                      }
                      props.toggleFollowingInProgress(false, u.id);
                    });
                  }}
                >
                  Follow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};