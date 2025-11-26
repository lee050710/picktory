package lyj.jpa.service;

import java.util.List;
import java.util.Map;

import lyj.jpa.model.Comment;
import lyj.jpa.repository.CommentSessionRepository;

public class CommentService {
    CommentSessionRepository commentRepository = new CommentSessionRepository();

    public Comment selectCommentByPrimaryKey(Long commentNo){
        return commentRepository.selectCommentByPrimaryKey(commentNo);
    }
}