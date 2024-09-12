package service;


import dto.UserDto;
import entity.User;
import lombok.RequiredArgsConstructor;
import mapper.UserMapper;
import org.springframework.stereotype.Service;
import repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public long create(UserDto userDto) {
        User user = userMapper.toEntity(userDto);
        userRepository.save(user);
        return user.getId();
    }

    public UserDto findById(long id) {
        User user = userRepository.findById(id).get();
        return userMapper.toDto(user);
    }

    public List<UserDto> findAll() {

        return userMapper.toDtoList(userRepository.findAll());
    }
    public UserDto update(UserDto userDto){
        User user=userRepository.findById(userDto.getId()).get();
        userMapper.Update(userDto,user);
        userRepository.save(user);

        return userMapper.toDto(user);
    }
    public void delete(long id){
        userRepository.deleteById(id);
    }
}
