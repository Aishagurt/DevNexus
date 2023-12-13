package com.devnexus.mapper;

import com.devnexus.dto.UserDto;
import com.devnexus.model.db.User;
import lombok.experimental.UtilityClass;

@UtilityClass
public class UserMapper {

    public UserDto userToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setName(user.getName());
        userDto.setSurname(user.getSurname());
        userDto.setEmail(user.getEmail());
        userDto.setBirthDate(user.getBirthDate());
        userDto.setPassword(user.getPassword());
        return userDto;
    }
}
