package com.HabeshaTreasure.HabeshaTreasure.Repository;

import com.HabeshaTreasure.HabeshaTreasure.DTO.UserProjection;
import com.HabeshaTreasure.HabeshaTreasure.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query(
            value = "SELECT u.id AS id, " +
                    "u.email AS email, " +
                    "info.first_name AS firstName, " +
                    "info.last_name AS lastName, " +
                    "info.phone_number AS phoneNumber, " +
                    "u.role AS role " +
                    "FROM users u " +
                    "right JOIN users_info info ON u.id = info.user_id",
            nativeQuery = true
    )
    List<UserProjection> findAllUsersWithUsersInfo();

    @Query(
            value = "SELECT u.id AS id, " +
                    "u.email AS email, " +
                    "info.first_name AS firstName, " +
                    "info.last_name AS lastName, " +
                    "info.phone_number AS phoneNumber, " +
                    "u.role AS role " +
                    "FROM users u " +
                    "right JOIN users_info info ON u.id = info.user_id WHERE u.id = ?1",
            nativeQuery = true
    )
    UserProjection findUserById(Long id);

    @Query("""
    SELECT 
        u.id AS id,
        u.email AS email,
        i.firstName AS firstName,
        i.lastName AS lastName,
        i.phoneNumber AS phoneNumber,
        u.role AS role
    FROM User u
    JOIN u.usersInfo i
    WHERE u.email = :email
""")
    UserProjection findProjectedByEmail(@Param("email") String email);


}
