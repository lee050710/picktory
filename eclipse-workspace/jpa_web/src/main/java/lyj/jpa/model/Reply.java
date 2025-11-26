package lyj.jpa.model;

import java.io.Serializable; 
import jakarta.persistence.*; 
import lombok.*; 

@Entity
@Table(name = "reply")
@Setter
@Getter
@NoArgsConstructor
@ToString
public class Reply implements Serializable { 
    
    private static final long serialVersionUID = 1L; // 직렬화 ID 추가
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_no")
    private Long replyNo;
    
    @Column(name = "comment_no")
    private Long commentNo;
    
    @Column(name = "reply_content")
    private String replyContent;
    
    @Column(name = "reply_user_id")
    private String replyUserId;
}